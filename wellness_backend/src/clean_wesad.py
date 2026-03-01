import pickle
import numpy as np
import pandas as pd
import os
from pathlib import Path

# ─────────────────────────────────────────
# WESAD标签说明：
# 0 = 未定义  ← 丢弃
# 1 = 正常/基线
# 2 = 压力（做数学题+演讲）
# 3 = 放松（看有趣视频）
# 4 = 冥想  ← 丢弃（部分受试者没有）
# ─────────────────────────────────────────

WESAD_PATH = '/Users/stellamao/.cache/kagglehub/datasets/orvile/wesad-wearable-stress-affect-detection-dataset/versions/1/WESAD'
BASE_DIR = Path(__file__).resolve().parent.parent
OUTPUT_PATH = BASE_DIR / "data" / "processed" / "wesad_features.csv"

# 所有受试者
SUBJECTS = ['S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'S9', 
            'S10', 'S11', 'S13', 'S14', 'S15', 'S16', 'S17']

def extract_features_from_window(window):
    """从一个时间窗口提取统计特征"""
    if len(window) == 0:
        return None
    return {
        'mean': np.mean(window),
        'std': np.std(window),
        'min': np.min(window),
        'max': np.max(window),
        'range': np.max(window) - np.min(window),
    }

def process_subject(subject_id):
    pkl_path = os.path.join(WESAD_PATH, subject_id, f'{subject_id}.pkl')
    
    with open(pkl_path, 'rb') as f:
        data = pickle.load(f, encoding='latin1')
    
    labels = data['label']  # 每个时间点的标签，采样率700Hz
    
    # 使用腕部传感器（E4，更接近Apple Watch）
    wrist = data['signal']['wrist']
    
    # 腕部有：ACC(加速度), BVP(血容量脉冲), EDA(皮肤电导), TEMP(体温)
    bvp  = wrist['BVP'].flatten()   # 64Hz
    eda  = wrist['EDA'].flatten()   # 4Hz
    temp = wrist['TEMP'].flatten()  # 4Hz
    acc  = wrist['ACC']             # 32Hz, 3轴
    
    # label是700Hz，需要对齐到4Hz（最低采样率）
    # 4Hz意味着每0.25秒一个点
    # 用窗口方式：每60秒（240个4Hz点）提取一次特征
    
    WINDOW_SIZE = 240   # 60秒 × 4Hz
    STEP_SIZE = 120     # 30秒步进（50%重叠）
    
    # label降采样到4Hz（700/4 ≈ 175，每175个label点取一个）
    label_downsample_rate = len(labels) // len(eda)
    labels_4hz = labels[::label_downsample_rate][:len(eda)]
    
    # BVP降采样到4Hz（64/4 = 16，每16个点取一个）
    bvp_4hz = bvp[::16][:len(eda)]
    
    # ACC降采样到4Hz（32/4 = 8，每8个点取一个）
    acc_mag = np.sqrt(np.sum(acc**2, axis=1))  # 合并3轴为幅度
    acc_4hz = acc_mag[::8][:len(eda)]
    
    rows = []
    for i in range(0, len(eda) - WINDOW_SIZE, STEP_SIZE):
        window_label = labels_4hz[i:i+WINDOW_SIZE]
        
        # 取窗口内众数作为标签
        unique, counts = np.unique(window_label, return_counts=True)
        dominant_label = unique[np.argmax(counts)]
        
        # 只保留标签1（正常）、2（压力）、3（放松）
        if dominant_label not in [1, 2, 3]:
            continue
        
        # 窗口纯度检查：80%以上是同一标签才保留
        if np.max(counts) / len(window_label) < 0.8:
            continue
        
        # 提取各信号特征
        bvp_feat  = extract_features_from_window(bvp_4hz[i:i+WINDOW_SIZE])
        eda_feat  = extract_features_from_window(eda[i:i+WINDOW_SIZE])
        temp_feat = extract_features_from_window(temp[i:i+WINDOW_SIZE])
        acc_feat  = extract_features_from_window(acc_4hz[i:i+WINDOW_SIZE])
        
        row = {
            'subject_id': subject_id,
            'stress_label': dominant_label,  # 1=正常 2=压力 3=放松
            # BVP（近似心率）
            'bvp_mean': bvp_feat['mean'],
            'bvp_std': bvp_feat['std'],
            'bvp_range': bvp_feat['range'],
            # EDA（皮肤电导，压力指标）
            'eda_mean': eda_feat['mean'],
            'eda_std': eda_feat['std'],
            'eda_max': eda_feat['max'],
            # 体温
            'temp_mean': temp_feat['mean'],
            'temp_std': temp_feat['std'],
            # 加速度（活动量）
            'acc_mean': acc_feat['mean'],
            'acc_std': acc_feat['std'],
        }
        rows.append(row)
    
    return pd.DataFrame(rows)

# ─────────────────────────────────────────
# 处理所有受试者
# ─────────────────────────────────────────
all_data = []
for subject in SUBJECTS:
    print(f"处理 {subject}...")
    try:
        df = process_subject(subject)
        all_data.append(df)
        print(f"  → {len(df)} 个窗口，标签分布: {df['stress_label'].value_counts().to_dict()}")
    except Exception as e:
        print(f"  ✗ 跳过 {subject}: {e}")

# ─────────────────────────────────────────
# 合并 & 清洗
# ─────────────────────────────────────────
final_df = pd.concat(all_data, ignore_index=True)

# 标签转换为更直观的名字
label_map = {1: 'baseline', 2: 'stress', 3: 'relaxed'}
final_df['stress_label_name'] = final_df['stress_label'].map(label_map)

# 删除NaN
final_df = final_df.dropna()

# 保存
final_df.to_csv(OUTPUT_PATH, index=False)

print(f"\n✅ WESAD清洗完成！")
print(f"   总样本数：{len(final_df)}")
print(f"   受试者数：{final_df['subject_id'].nunique()}")
print(f"   特征数量：{len(final_df.columns) - 3} 个")  # 减去subject_id和两个label列
print(f"   标签分布：")
print(final_df['stress_label_name'].value_counts())
print(f"\n   保存路径：{OUTPUT_PATH}")
