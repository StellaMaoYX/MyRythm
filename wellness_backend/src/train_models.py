import pandas as pd
import numpy as np
from pathlib import Path
from xgboost import XGBClassifier
from sklearn.model_selection import StratifiedKFold, cross_val_score
from sklearn.metrics import classification_report, confusion_matrix
from sklearn.preprocessing import LabelEncoder
import joblib
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import seaborn as sns

BASE_DIR = Path(__file__).resolve().parent.parent
WESAD_PATH = BASE_DIR / "data" / "processed" / "wesad_features.csv"
LIFESNAPS_PATH = BASE_DIR / "data" / "processed" / "lifesnaps_features.csv"
MODEL_PATH = BASE_DIR / "models" / "latest" / "stress_model.pkl"
MOOD_MODEL_PATH = BASE_DIR / "models" / "latest" / "mood_model.pkl"
PLOT_PATH = BASE_DIR / "models" / "model_results.png"

# ─────────────────────────────────────────
# 1. 准备WESAD（压力模型）
# 共同特征：hr(bvp), hrv(rmssd), temp
# ─────────────────────────────────────────
wesad = pd.read_csv(WESAD_PATH)

# 统一列名映射到通用名
wesad_stress = pd.DataFrame({
    'hr_mean':      wesad['bvp_mean'],
    'hr_std':       wesad['bvp_std'],
    'hrv_mean':     wesad['bvp_std'],   # WESAD没有直接HRV，用BVP std近似
    'temp_mean':    wesad['temp_mean'],
    'temp_std':     wesad['temp_std'],
    'acc_mean':     wesad['acc_mean'],
    'stress_label': wesad['stress_label'] - 1,  # 1/2/3 → 0/1/2
    'source':       'wesad'
})
# WESAD: 1=baseline→0, 2=stress→1, 3=relaxed→2
# 重新映射：0=relaxed, 1=baseline, 2=stress（统一语义）
label_remap_wesad = {0: 1, 1: 2, 2: 0}  # baseline→1, stress→2, relaxed→0
wesad_stress['stress_label'] = wesad_stress['stress_label'].map(label_remap_wesad)

print(f"WESAD样本：{len(wesad_stress)}")
print(f"WESAD标签分布：{wesad_stress['stress_label'].value_counts().to_dict()}")

# ─────────────────────────────────────────
# 2. 准备LifeSnaps（压力模型）
# ─────────────────────────────────────────
lifesnaps = pd.read_csv(LIFESNAPS_PATH)

lifesnaps_stress = pd.DataFrame({
    'hr_mean':      lifesnaps['bpm'],
    'hr_std':       np.nan,
    'hrv_mean':     lifesnaps['rmssd'],
    'temp_mean':    lifesnaps['nightly_temperature'],
    'temp_std':     np.nan,
    'acc_mean':     lifesnaps['steps'] / 1000,   # 步数归一化近似活动量
    'stress_label': lifesnaps['stress_label'],    # 已经是0/1/2
    'source':       'lifesnaps'
})

print(f"\nLifeSnaps样本：{len(lifesnaps_stress)}")
print(f"LifeSnaps标签分布：{lifesnaps_stress['stress_label'].value_counts().to_dict()}")

# ─────────────────────────────────────────
# 3. 合并训练压力模型
# ─────────────────────────────────────────
combined = pd.concat([wesad_stress, lifesnaps_stress], ignore_index=True)

FEATURES = ['hr_mean', 'hr_std', 'hrv_mean', 'temp_mean', 'temp_std', 'acc_mean']

# 用全局均值填补NaN
for col in FEATURES:
    combined[col] = combined[col].fillna(combined[col].mean())

X = combined[FEATURES]
y = combined['stress_label'].astype(int)

print(f"\n合并后总样本：{len(combined)}")
print(f"合并后标签分布（0=放松, 1=正常, 2=压力）：{y.value_counts().to_dict()}")

# ─────────────────────────────────────────
# 4. 训练压力模型
# ─────────────────────────────────────────
print("\n开始训练压力模型...")

model_stress = XGBClassifier(
    n_estimators=200,
    max_depth=6,
    learning_rate=0.1,
    scale_pos_weight=1,
    use_label_encoder=False,
    eval_metric='mlogloss',
    verbosity=0,
)

# 5折交叉验证
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
scores = cross_val_score(model_stress, X, y, cv=cv, scoring='accuracy')
print(f"交叉验证准确率：{scores.mean():.3f} ± {scores.std():.3f}")

# 用全部数据训练最终模型
model_stress.fit(X, y)
joblib.dump(model_stress, MODEL_PATH)
print(f"压力模型已保存：{MODEL_PATH}")

# ─────────────────────────────────────────
# 5. 训练心情模型（仅用LifeSnaps，因为有心情标签）
# ─────────────────────────────────────────
print("\n开始训练心情模型...")

MOOD_FEATURES = [
    'resting_hr', 'bpm', 'rmssd',
    'sleep_hours', 'sleep_efficiency', 'sleep_deep_ratio', 'sleep_rem_ratio',
    'steps', 'very_active_minutes', 'sedentary_minutes',
    'stress_score',
]

# 过滤掉缺失的特征列
available_mood_features = [f for f in MOOD_FEATURES if f in lifesnaps.columns]
lifesnaps_mood = lifesnaps[available_mood_features + ['mood_label']].dropna()

X_mood = lifesnaps_mood[available_mood_features]
y_mood = lifesnaps_mood['mood_label'].astype(int)

print(f"心情模型样本：{len(lifesnaps_mood)}")
print(f"心情标签分布（0=差, 1=中, 2=好）：{y_mood.value_counts().to_dict()}")

model_mood = XGBClassifier(
    n_estimators=200,
    max_depth=6,
    learning_rate=0.1,
    use_label_encoder=False,
    eval_metric='mlogloss',
    verbosity=0,
)

scores_mood = cross_val_score(model_mood, X_mood, y_mood, cv=cv, scoring='accuracy')
print(f"交叉验证准确率：{scores_mood.mean():.3f} ± {scores_mood.std():.3f}")

model_mood.fit(X_mood, y_mood)
joblib.dump(model_mood, MOOD_MODEL_PATH)
print(f"心情模型已保存：{MOOD_MODEL_PATH}")

# ─────────────────────────────────────────
# 6. 可视化结果
# ─────────────────────────────────────────
fig, axes = plt.subplots(1, 2, figsize=(14, 5))

# 图1：Feature Importance（压力模型）
importance = pd.Series(model_stress.feature_importances_, index=FEATURES)
importance.sort_values().plot(kind='barh', ax=axes[0], color='steelblue')
axes[0].set_title('Feature Importance - Stress Model')
axes[0].set_xlabel('Importance Score')

# 图2：Feature Importance（心情模型）
importance_mood = pd.Series(model_mood.feature_importances_, index=available_mood_features)
importance_mood.sort_values().plot(kind='barh', ax=axes[1], color='coral')
axes[1].set_title('Feature Importance - Mood Model')
axes[1].set_xlabel('Importance Score')

plt.tight_layout()
plt.savefig(PLOT_PATH, dpi=150, bbox_inches='tight')
print(f"\n图表已保存：{PLOT_PATH}")

# ─────────────────────────────────────────
# 7. 测试预测（模拟一个用户）
# ─────────────────────────────────────────
print("\n─── 模拟预测测试 ───")

sample_user = pd.DataFrame([{
    'hr_mean': 75,
    'hr_std': 8,
    'hrv_mean': 35,    # HRV偏低，可能有压力
    'temp_mean': 34.5,
    'temp_std': 0.3,
    'acc_mean': 6,
}])

stress_pred = model_stress.predict(sample_user)[0]
stress_prob = model_stress.predict_proba(sample_user)[0]
stress_map = {0: '放松', 1: '正常', 2: '有压力'}

print(f"压力预测：{stress_map[stress_pred]}")
print(f"概率分布：放松={stress_prob[0]:.2f}, 正常={stress_prob[1]:.2f}, 有压力={stress_prob[2]:.2f}")

print("\n✅ 所有模型训练完成！")
print(f"   压力模型：{MODEL_PATH}")
print(f"   心情模型：{MOOD_MODEL_PATH}")
