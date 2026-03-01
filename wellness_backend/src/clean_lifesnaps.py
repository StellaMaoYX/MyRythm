import pandas as pd
import numpy as np
from pathlib import Path

DATA_PATH   = '/Users/stellamao/.cache/kagglehub/datasets/skywescar/lifesnaps-fitbit-dataset/versions/1/rais_anonymized/csv_rais_anonymized/daily_fitbit_sema_df_unprocessed.csv'
BASE_DIR = Path(__file__).resolve().parent.parent
OUTPUT_PATH = BASE_DIR / "data" / "processed" / "lifesnaps_features.csv"

# ─────────────────────────────────────────
# 1. 加载数据
# ─────────────────────────────────────────
df = pd.read_csv(DATA_PATH)
print(f"原始数据：{df.shape}")

# ─────────────────────────────────────────
# 2. 选取需要的列
# ─────────────────────────────────────────
FEATURE_COLS = [
    # 生理指标（和Apple Watch重叠的特征）
    'resting_hr',           # 静息心率
    'bpm',                  # 平均心率
    'rmssd',                # HRV（心率变异性）
    'nremhr',               # 非快速眼动期心率
    'spo2',                 # 血氧
    'nightly_temperature',  # 夜间体温
    'stress_score',         # Fitbit压力分数 ← 重要标签来源
    
    # 睡眠
    'sleep_duration',
    'minutesAsleep',
    'minutesAwake',
    'sleep_efficiency',
    'sleep_deep_ratio',
    'sleep_rem_ratio',
    'sleep_wake_ratio',
    
    # 运动
    'steps',
    'calories',
    'lightly_active_minutes',
    'moderately_active_minutes',
    'very_active_minutes',
    'sedentary_minutes',
    
    # 心情标签（SEMA问卷，这是ground truth！）
    'HAPPY',
    'SAD',
    'ALERT',
    'NEUTRAL',
    'RESTED/RELAXED',
    'TENSE/ANXIOUS',
    'TIRED',
    
    # 场景
    'WORK/SCHOOL',
    'HOME',
    'OUTDOORS',
    'GYM',
]

df = df[['id', 'date'] + FEATURE_COLS].copy()

# ─────────────────────────────────────────
# 3. 处理睡眠时长（原始是毫秒）
# ─────────────────────────────────────────
df['sleep_hours'] = df['sleep_duration'] / (1000 * 60 * 60)
df = df.drop(columns=['sleep_duration'])

# 异常值处理
df.loc[df['sleep_hours'] > 24, 'sleep_hours'] = np.nan
df.loc[df['sleep_hours'] < 0, 'sleep_hours'] = np.nan

# ─────────────────────────────────────────
# 4. 生成标签
# ─────────────────────────────────────────

# 标签A：压力等级（基于stress_score）
# stress_score范围0-100，越低压力越大
def stress_to_label(score):
    if pd.isna(score):
        return np.nan
    if score >= 75:
        return 0   # 低压力
    elif score >= 50:
        return 1   # 中压力
    else:
        return 2   # 高压力

df['stress_label'] = df['stress_score'].apply(stress_to_label)

# 标签B：心情分数（基于SEMA问卷的心情选项）
mood_cols = ['HAPPY', 'SAD', 'ALERT', 'NEUTRAL', 'RESTED/RELAXED', 'TENSE/ANXIOUS', 'TIRED']
df['has_mood_data'] = df[mood_cols].notna().any(axis=1)

def calc_mood_score(row):
    positive = 0
    negative = 0
    if row.get('HAPPY') == 1:    positive += 2
    if row.get('ALERT') == 1:    positive += 1
    if row.get('RESTED/RELAXED') == 1: positive += 2
    if row.get('NEUTRAL') == 1:  positive += 0
    if row.get('SAD') == 1:      negative += 2
    if row.get('TENSE/ANXIOUS') == 1: negative += 2
    if row.get('TIRED') == 1:    negative += 1
    
    net = positive - negative
    if net >= 2:    return 2   # 好心情
    elif net >= 0:  return 1   # 中等
    else:           return 0   # 差心情

df['mood_label'] = df.apply(calc_mood_score, axis=1)

# ─────────────────────────────────────────
# 5. 异常值处理
# ─────────────────────────────────────────
df.loc[df['resting_hr'] < 30, 'resting_hr'] = np.nan
df.loc[df['resting_hr'] > 120, 'resting_hr'] = np.nan
df.loc[df['bpm'] < 30, 'bpm'] = np.nan
df.loc[df['bpm'] > 220, 'bpm'] = np.nan
df.loc[df['spo2'] < 80, 'spo2'] = np.nan
df.loc[df['steps'] < 0, 'steps'] = np.nan
df.loc[df['steps'] > 100000, 'steps'] = np.nan

# ─────────────────────────────────────────
# 6. 填补缺失值（用每个用户自己的均值）
# ─────────────────────────────────────────
numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
numeric_cols = [c for c in numeric_cols if c not in ['stress_label', 'mood_label']]

df[numeric_cols] = df.groupby('id')[numeric_cols].transform(
    lambda x: x.fillna(x.mean())
)
df[numeric_cols] = df[numeric_cols].fillna(df[numeric_cols].mean())

# ─────────────────────────────────────────
# 7. 只保留有标签的行
# ─────────────────────────────────────────
df_with_stress = df.dropna(subset=['stress_label'])
df_with_mood   = df.dropna(subset=['mood_label'])

print(f"\n有压力标签的样本：{len(df_with_stress)}")
print(f"压力标签分布：\n{df_with_stress['stress_label'].value_counts()}")
print(f"\n有心情标签的样本：{len(df_with_mood)}")
print(f"心情标签分布：\n{df_with_mood['mood_label'].value_counts()}")

# ─────────────────────────────────────────
# 8. 保存
# ─────────────────────────────────────────
df_final = df.dropna(subset=['stress_label'])
df_final.to_csv(OUTPUT_PATH, index=False)

print(f"\n✅ LifeSnaps清洗完成！")
print(f"   总样本数：{len(df_final)}")
print(f"   用户数：{df_final['id'].nunique()}")
print(f"   特征数：{len(df_final.columns)}")
print(f"   保存路径：{OUTPUT_PATH}")
print(f"\n各特征缺失率：")
miss = (df_final.isnull().sum() / len(df_final) * 100).round(1)
print(miss[miss > 0].to_string() if miss[miss > 0].any() else "  全部0% ✅")
