import argparse
from pathlib import Path

import joblib
import numpy as np
import pandas as pd


STRESS_LABEL_MAP = {0: "放松", 1: "正常", 2: "有压力"}
MOOD_LABEL_MAP = {0: "差", 1: "中", 2: "好"}
BASE_DIR = Path(__file__).resolve().parent.parent


def build_stress_features(df: pd.DataFrame, required_features: list[str]) -> pd.DataFrame:
    # If columns are already in the training feature shape, use directly.
    if all(col in df.columns for col in required_features):
        X = df[required_features].copy()
    # Otherwise try to map from daily_features.csv format.
    elif {"hr_mean", "hr_std", "hrv_mean", "wrist_temp", "steps"}.issubset(df.columns):
        X = pd.DataFrame(
            {
                "hr_mean": df["hr_mean"],
                "hr_std": df["hr_std"],
                "hrv_mean": df["hrv_mean"],
                "temp_mean": df["wrist_temp"],
                "temp_std": df["wrist_temp"].rolling(7, min_periods=1).std().fillna(0),
                "acc_mean": df["steps"] / 1000.0,
            }
        )
        X = X[required_features]
    # Map from lifesnaps_features.csv format.
    elif {"bpm", "rmssd", "nightly_temperature", "steps"}.issubset(df.columns):
        X = pd.DataFrame(
            {
                "hr_mean": df["bpm"],
                "hr_std": pd.Series([float("nan")] * len(df)),
                "hrv_mean": df["rmssd"],
                "temp_mean": df["nightly_temperature"],
                "temp_std": pd.Series([float("nan")] * len(df)),
                "acc_mean": df["steps"] / 1000.0,
            }
        )
        X = X[required_features]
    else:
        raise ValueError(
            "无法构建压力特征。请提供以下任一列集合："
            f"1) 训练特征 {required_features}；"
            "2) daily_features 所需列 ['hr_mean','hr_std','hrv_mean','wrist_temp','steps']"
        )

    for col in X.columns:
        X[col] = X[col].fillna(X[col].mean())
    return X


def build_mood_features(df: pd.DataFrame, required_features: list[str]) -> pd.DataFrame:
    missing = [col for col in required_features if col not in df.columns]
    if missing:
        raise ValueError(f"心情模型缺少输入列：{missing}")
    X = df[required_features].copy()
    for col in X.columns:
        X[col] = X[col].fillna(X[col].mean())
    return X


def build_personal_features(df: pd.DataFrame, feature_names: list[str]) -> pd.DataFrame:
    X = pd.DataFrame(index=df.index)
    for col in feature_names:
        if col in df.columns:
            X[col] = df[col]
        elif col == "temp_mean" and "wrist_temp" in df.columns:
            X[col] = df["wrist_temp"]
        elif col == "temp_std" and "wrist_temp" in df.columns:
            X[col] = df["wrist_temp"].rolling(7, min_periods=1).std().fillna(0)
        elif col == "acc_mean" and "steps" in df.columns:
            X[col] = df["steps"] / 1000.0
        elif col == "sentiment_score":
            X[col] = 0.0
        else:
            X[col] = np.nan

    for col in X.columns:
        X[col] = pd.to_numeric(X[col], errors="coerce")
        X[col] = X[col].fillna(X[col].mean())
        X[col] = X[col].fillna(0)
    return X


def blend_prob(global_prob: np.ndarray, personal_prob: np.ndarray, global_weight: float) -> np.ndarray:
    personal_weight = 1.0 - global_weight
    return global_weight * global_prob + personal_weight * personal_prob


def main() -> None:
    parser = argparse.ArgumentParser(description="Run stress/mood prediction from csv features.")
    parser.add_argument(
        "--input",
        default=str(BASE_DIR / "data" / "processed" / "daily_features.csv"),
        help="Input CSV path.",
    )
    parser.add_argument("--stress-model", default=str(BASE_DIR / "models" / "latest" / "stress_model.pkl"), help="Stress model path.")
    parser.add_argument("--mood-model", default=str(BASE_DIR / "models" / "latest" / "mood_model.pkl"), help="Mood model path.")
    parser.add_argument("--predict-mood", action="store_true", help="Also run mood prediction.")
    parser.add_argument("--user-id", help="User id for personalized inference")
    parser.add_argument("--use-personal", action="store_true", help="Use personal model if available")
    parser.add_argument("--personal-dir", default=str(BASE_DIR / "models" / "personal"), help="Personal model directory")
    parser.add_argument("--global-weight", type=float, default=0.7, help="Global model weight in blended prob")
    parser.add_argument(
        "--output",
        default=str(BASE_DIR / "data" / "processed" / "predictions.csv"),
        help="Output CSV path.",
    )
    args = parser.parse_args()

    input_path = Path(args.input)
    out_path = Path(args.output)
    stress_model_path = Path(args.stress_model)
    mood_model_path = Path(args.mood_model)
    personal_dir = Path(args.personal_dir)

    if not input_path.exists():
        raise FileNotFoundError(f"输入文件不存在: {input_path}")
    if not stress_model_path.exists():
        raise FileNotFoundError(f"压力模型不存在: {stress_model_path}")
    if not (0 <= args.global_weight <= 1):
        raise ValueError("--global-weight 必须在 [0,1] 区间")

    df = pd.read_csv(input_path)
    stress_model = joblib.load(stress_model_path)
    stress_features = [
        str(x)
        for x in getattr(
            stress_model,
            "feature_names_in_",
            ["hr_mean", "hr_std", "hrv_mean", "temp_mean", "temp_std", "acc_mean"],
        )
    ]

    X_stress = build_stress_features(df, stress_features)
    stress_pred = stress_model.predict(X_stress)
    stress_prob = stress_model.predict_proba(X_stress)
    stress_source = "global"

    if args.use_personal and args.user_id:
        personal_stress_path = personal_dir / f"{args.user_id}_stress_personal.pkl"
        if personal_stress_path.exists():
            bundle = joblib.load(personal_stress_path)
            if bundle.get("initialized", False):
                p_features = [str(x) for x in bundle["feature_names"]]
                Xp = build_personal_features(df, p_features)
                Xp_scaled = bundle["scaler"].transform(Xp)
                p_prob = bundle["model"].predict_proba(Xp_scaled)
                stress_prob = blend_prob(stress_prob, p_prob, args.global_weight)
                stress_pred = stress_prob.argmax(axis=1)
                stress_source = "blended"

    out = pd.DataFrame(index=df.index)
    if "date" in df.columns:
        out["date"] = df["date"]
    out["stress_pred_code"] = stress_pred.astype(int)
    out["stress_pred_label"] = out["stress_pred_code"].map(STRESS_LABEL_MAP)
    out["p_relax"] = stress_prob[:, 0]
    out["p_normal"] = stress_prob[:, 1]
    out["p_stress"] = stress_prob[:, 2]
    out["stress_model_source"] = stress_source

    if args.predict_mood:
        mood_pred = None
        mood_prob = None
        mood_source = None

        if mood_model_path.exists():
            mood_model = joblib.load(mood_model_path)
            mood_features = [str(x) for x in getattr(mood_model, "feature_names_in_", [])]
            if mood_features:
                try:
                    X_mood = build_mood_features(df, mood_features)
                    mood_pred = mood_model.predict(X_mood)
                    mood_prob = mood_model.predict_proba(X_mood)
                    mood_source = "global"
                except ValueError:
                    pass

        used_personal_mood = False
        if args.use_personal and args.user_id:
            personal_mood_path = personal_dir / f"{args.user_id}_mood_personal.pkl"
            if personal_mood_path.exists():
                m_bundle = joblib.load(personal_mood_path)
                if m_bundle.get("initialized", False):
                    m_features = [str(x) for x in m_bundle["feature_names"]]
                    Xm_p = build_personal_features(df, m_features)
                    Xm_scaled = m_bundle["scaler"].transform(Xm_p)
                    m_prob = m_bundle["model"].predict_proba(Xm_scaled)
                    if mood_prob is None:
                        mood_prob = m_prob
                        mood_pred = mood_prob.argmax(axis=1)
                        mood_source = "personal"
                    else:
                        mood_prob = blend_prob(mood_prob, m_prob, args.global_weight)
                        mood_pred = mood_prob.argmax(axis=1)
                        mood_source = "blended"
                    used_personal_mood = True

        if mood_prob is None or mood_pred is None:
            if not mood_model_path.exists() and not used_personal_mood:
                raise FileNotFoundError(f"心情模型不存在: {mood_model_path}")
            raise ValueError("无法进行心情预测：全局心情特征不足，且无可用个人心情模型")

        out["mood_pred_code"] = mood_pred.astype(int)
        out["mood_pred_label"] = out["mood_pred_code"].map(MOOD_LABEL_MAP)
        out["p_mood_bad"] = mood_prob[:, 0]
        out["p_mood_mid"] = mood_prob[:, 1]
        out["p_mood_good"] = mood_prob[:, 2]
        out["mood_model_source"] = mood_source

    out_path.parent.mkdir(parents=True, exist_ok=True)
    out.to_csv(out_path, index=False)

    print(f"预测完成: {out_path}")
    print(f"样本数: {len(out)}")
    print(out.tail(5).to_string(index=False))


if __name__ == "__main__":
    main()
