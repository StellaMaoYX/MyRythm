import xml.etree.ElementTree as ET
import pandas as pd
import numpy as np
import os
from pathlib import Path

# ─────────────────────────────────────────
# 1. 读取数据
# ─────────────────────────────────────────
BASE_DIR = Path(__file__).resolve().parent.parent
EXPORT_PATH = BASE_DIR / "data" / "raw" / "apple_health_export" / "export.xml"
OUTPUT_PATH = BASE_DIR / "data" / "processed" / "daily_features.csv"

print("正在读取 export.xml，可能需要1-2分钟...")
tree = ET.parse(EXPORT_PATH)
root = tree.getroot()
print("读取完成！")

# ─────────────────────────────────────────
# 2. 提取需要的字段
# ─────────────────────────────────────────
target_types = [
    'HKQuantityTypeIdentifierHeartRate',
    'HKQuantityTypeIdentifierRestingHeartRate',
    'HKQuantityTypeIdentifierHeartRateVariabilitySDNN',
    'HKQuantityTypeIdentifierOxygenSaturation',
    'HKQuantityTypeIdentifierRespiratoryRate',
    'HKQuantityTypeIdentifierStepCount',
    'HKQuantityTypeIdentifierActiveEnergyBurned',
    'HKQuantityTypeIdentifierAppleExerciseTime',
    'HKQuantityTypeIdentifierAppleSleepingWristTemperature',
    'HKCategoryTypeIdentifierSleepAnalysis',
    'HKCategoryTypeIdentifierMenstrualFlow',
]

records = []
for record in root.findall('Record'):
    rtype = record.get('type')
    if rtype in target_types:
        records.append({
            'type': rtype,
            'value': record.get('value'),
            'startDate': record.get('startDate'),
            'endDate': record.get('endDate'),
        })

df = pd.DataFrame(records)
df['value'] = pd.to_numeric(df['value'], errors='coerce')
df['startDate'] = pd.to_datetime(df['startDate']).dt.tz_localize(None)
df['endDate'] = pd.to_datetime(df['endDate']).dt.tz_localize(None)
df['date'] = df['startDate'].dt.date

print(f"原始记录数：{len(df)}")

# ─────────────────────────────────────────
# 3. 按天聚合每个指标
# ─────────────────────────────────────────

def agg(df, hk_type, col_name, method='mean'):
    subset = df[df['type'] == hk_type].groupby('date')['value']
    if method == 'mean':
        return subset.mean().rename(col_name)
    elif method == 'std':
        return subset.std().rename(col_name)
    elif method == 'sum':
        return subset.sum().rename(col_name)
    elif method == 'min':
        return subset.min().rename(col_name)
    elif method == 'max':
        return subset.max().rename(col_name)

# 心率
hr_mean   = agg(df, 'HKQuantityTypeIdentifierHeartRate', 'hr_mean', 'mean')
hr_std    = agg(df, 'HKQuantityTypeIdentifierHeartRate', 'hr_std', 'std')
hr_min    = agg(df, 'HKQuantityTypeIdentifierHeartRate', 'hr_min', 'min')
hr_max    = agg(df, 'HKQuantityTypeIdentifierHeartRate', 'hr_max', 'max')

# 静息心率
resting_hr = agg(df, 'HKQuantityTypeIdentifierRestingHeartRate', 'resting_hr', 'mean')

# HRV（压力最强预测指标）
hrv_mean  = agg(df, 'HKQuantityTypeIdentifierHeartRateVariabilitySDNN', 'hrv_mean', 'mean')

# 血氧
spo2_mean = agg(df, 'HKQuantityTypeIdentifierOxygenSaturation', 'spo2_mean', 'mean')

# 呼吸率
resp_mean = agg(df, 'HKQuantityTypeIdentifierRespiratoryRate', 'respiratory_rate', 'mean')

# 运动
steps          = agg(df, 'HKQuantityTypeIdentifierStepCount', 'steps', 'sum')
active_energy  = agg(df, 'HKQuantityTypeIdentifierActiveEnergyBurned', 'active_energy', 'sum')
exercise_mins  = agg(df, 'HKQuantityTypeIdentifierAppleExerciseTime', 'exercise_minutes', 'sum')

# 手腕体温
wrist_temp = agg(df, 'HKQuantityTypeIdentifierAppleSleepingWristTemperature', 'wrist_temp', 'mean')

# ─────────────────────────────────────────
# 4. 睡眠：单独处理
# ─────────────────────────────────────────
sleep_df = df[df['type'] == 'HKCategoryTypeIdentifierSleepAnalysis'].copy()
sleep_df['duration_hours'] = (
    sleep_df['endDate'] - sleep_df['startDate']
).dt.total_seconds() / 3600

# 打印看看你的value长什么样
print("睡眠value样本：", sleep_df['value'].unique())

# 排除InBed，只保留实际睡眠
exclude_keywords = ['InBed', 'Awake']
actual_sleep = sleep_df[
    ~sleep_df['value'].astype(str).str.contains('|'.join(exclude_keywords), na=False)
]

sleep_hours = actual_sleep.groupby('date')['duration_hours'].sum().rename('sleep_hours')
sleep_sessions = actual_sleep.groupby('date').size().rename('sleep_sessions')

# ─────────────────────────────────────────
# 5. 生理期：有记录的天标为1
# ─────────────────────────────────────────
mens_df = df[df['type'] == 'HKCategoryTypeIdentifierMenstrualFlow']
menstrual = (mens_df.groupby('date').size() > 0).astype(int).rename('menstrual_flow')

# ─────────────────────────────────────────
# 6. 合并所有特征
# ─────────────────────────────────────────
daily = pd.concat([
    hr_mean, hr_std, hr_min, hr_max,
    resting_hr, hrv_mean,
    spo2_mean, resp_mean,
    steps, active_energy, exercise_mins,
    wrist_temp,
    sleep_hours, sleep_sessions,
    menstrual,
], axis=1)

daily.index = pd.to_datetime(daily.index)
daily = daily.sort_index()

# ─────────────────────────────────────────
# 7. 数据质量处理
# ─────────────────────────────────────────

# 删除几乎全空的行（超过60%字段为空的天）
threshold = len(daily.columns) * 0.6
daily = daily.dropna(thresh=int(len(daily.columns) - threshold))

# 异常值处理（心率超出合理范围的设为NaN）
daily.loc[daily['hr_mean'] < 30, 'hr_mean'] = np.nan
daily.loc[daily['hr_mean'] > 220, 'hr_mean'] = np.nan
daily.loc[daily['resting_hr'] < 30, 'resting_hr'] = np.nan
daily.loc[daily['resting_hr'] > 120, 'resting_hr'] = np.nan
daily.loc[daily['spo2_mean'] < 80, 'spo2_mean'] = np.nan
daily.loc[daily['sleep_hours'] > 24, 'sleep_hours'] = np.nan

# 添加滚动特征（过去7天趋势，对预测很有帮助）
daily['hr_7day_avg'] = daily['hr_mean'].rolling(7, min_periods=1).mean()
daily['hrv_7day_avg'] = daily['hrv_mean'].rolling(7, min_periods=1).mean()
daily['sleep_7day_avg'] = daily['sleep_hours'].rolling(7, min_periods=1).mean()
daily['steps_7day_avg'] = daily['steps'].rolling(7, min_periods=1).mean()

# 生理期空的填0（没记录 = 不在生理期）
daily['menstrual_flow'] = daily['menstrual_flow'].fillna(0)

# 删除spo2（没有数据，留着没意义）
daily = daily.drop(columns=['spo2_mean'])

# 睡眠：用7天滚动均值填补
daily['sleep_hours'] = daily['sleep_hours'].fillna(daily['sleep_7day_avg'])
daily['sleep_sessions'] = daily['sleep_sessions'].fillna(
    daily['sleep_sessions'].rolling(7, min_periods=1).mean()
)

# 其他缺失用个人均值填补
for col in ['respiratory_rate', 'wrist_temp', 'resting_hr', 'hrv_mean', 'exercise_minutes']:
    daily[col] = daily[col].fillna(daily[col].mean())

print("填补后缺失率：")
print((daily.isnull().sum() / len(daily) * 100).round(1).to_string())

# ─────────────────────────────────────────
# 8. 保存
# ─────────────────────────────────────────
daily.to_csv(OUTPUT_PATH)
print(f"\n✅ 清洗完成！")
print(f"   总天数：{len(daily)} 天")
print(f"   时间范围：{daily.index.min().date()} 到 {daily.index.max().date()}")
print(f"   特征数量：{len(daily.columns)} 个")
print(f"   保存路径：{OUTPUT_PATH}")
print(f"\n各特征缺失率：")
print((daily.isnull().sum() / len(daily) * 100).round(1).to_string())
