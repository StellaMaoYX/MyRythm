import argparse
from pathlib import Path
from typing import Any

import joblib
import numpy as np
import pandas as pd
from sklearn.linear_model import SGDClassifier
from sklearn.preprocessing import StandardScaler


CLASS_VALUES = np.array([0, 1, 2])
BASE_DIR = Path(__file__).resolve().parent.parent


def load_or_init_bundle(path: Path, feature_names: list[str]) -> dict[str, Any]:
    if path.exists():
        bundle = joblib.load(path)
        if bundle.get("feature_names") != feature_names:
            raise ValueError(f"模型特征不匹配: {path}")
        return bundle

    return {
        "feature_names": feature_names,
        "scaler": StandardScaler(),
        "model": SGDClassifier(loss="log_loss", max_iter=1, learning_rate="optimal", tol=None, random_state=42),
        "classes": CLASS_VALUES,
        "trained_dates": [],
        "initialized": False,
    }


def partial_update_bundle(bundle: dict[str, Any], X: pd.DataFrame, y: pd.Series, date_series: pd.Series) -> tuple[dict[str, Any], int]:
    trained_dates = set(bundle.get("trained_dates", []))
    date_vals = date_series.astype(str)
    mask_new = ~date_vals.isin(trained_dates)

    X_new = X.loc[mask_new]
    y_new = y.loc[mask_new]
    d_new = date_vals.loc[mask_new]

    if len(X_new) == 0:
        return bundle, 0

    scaler: StandardScaler = bundle["scaler"]
    model: SGDClassifier = bundle["model"]

    scaler.partial_fit(X_new)
    X_scaled = scaler.transform(X_new)

    if not bundle.get("initialized", False):
        model.partial_fit(X_scaled, y_new, classes=bundle["classes"])
        bundle["initialized"] = True
    else:
        model.partial_fit(X_scaled, y_new)

    trained_dates.update(d_new.tolist())
    bundle["trained_dates"] = sorted(trained_dates)
    bundle["last_update"] = pd.Timestamp.now().isoformat()
    return bundle, len(X_new)


def build_stress_personal_features(daily_df: pd.DataFrame) -> pd.DataFrame:
    required = ["hr_mean", "hr_std", "hrv_mean", "wrist_temp", "steps"]
    missing = [c for c in required if c not in daily_df.columns]
    if missing:
        raise ValueError(f"daily_features 缺少压力特征列: {missing}")

    return pd.DataFrame(
        {
            "hr_mean": daily_df["hr_mean"],
            "hr_std": daily_df["hr_std"],
            "hrv_mean": daily_df["hrv_mean"],
            "temp_mean": daily_df["wrist_temp"],
            "temp_std": daily_df["wrist_temp"].rolling(7, min_periods=1).std().fillna(0),
            "acc_mean": daily_df["steps"] / 1000.0,
        }
    )


def build_mood_personal_features(daily_df: pd.DataFrame, merged_df: pd.DataFrame) -> pd.DataFrame:
    features = pd.DataFrame(
        {
            "resting_hr": daily_df.get("resting_hr"),
            "hr_mean": daily_df.get("hr_mean"),
            "hr_std": daily_df.get("hr_std"),
            "hrv_mean": daily_df.get("hrv_mean"),
            "respiratory_rate": daily_df.get("respiratory_rate"),
            "steps": daily_df.get("steps"),
            "exercise_minutes": daily_df.get("exercise_minutes"),
            "sleep_hours": daily_df.get("sleep_hours"),
            "wrist_temp": daily_df.get("wrist_temp"),
            "sentiment_score": merged_df.get("sentiment_score", pd.Series(0, index=merged_df.index)),
        }
    )
    return features


def fillna_with_mean(df: pd.DataFrame) -> pd.DataFrame:
    out = df.copy()
    for col in out.columns:
        out[col] = pd.to_numeric(out[col], errors="coerce")
        out[col] = out[col].fillna(out[col].mean())
        out[col] = out[col].fillna(0)
    return out


def main() -> None:
    parser = argparse.ArgumentParser(description="Incrementally update per-user personal models.")
    parser.add_argument("--user-id", required=True)
    parser.add_argument("--daily-features", default=str(BASE_DIR / "data" / "processed" / "daily_features.csv"))
    parser.add_argument("--feedback", default=str(BASE_DIR / "data" / "feedback" / "user_feedback.csv"))
    parser.add_argument("--personal-dir", default=str(BASE_DIR / "models" / "personal"))
    args = parser.parse_args()

    feedback_path = Path(args.feedback)
    daily_path = Path(args.daily_features)
    personal_dir = Path(args.personal_dir)
    personal_dir.mkdir(parents=True, exist_ok=True)

    if not feedback_path.exists():
        raise FileNotFoundError(f"反馈文件不存在: {feedback_path}")
    if not daily_path.exists():
        raise FileNotFoundError(f"daily_features 文件不存在: {daily_path}")

    fb = pd.read_csv(feedback_path)
    fb = fb[fb["user_id"].astype(str) == str(args.user_id)].copy()
    if len(fb) == 0:
        raise ValueError(f"没有找到用户 {args.user_id} 的反馈")

    daily = pd.read_csv(daily_path)
    if "date" not in daily.columns:
        raise ValueError("daily_features.csv 缺少 date 列")

    fb["date"] = fb["date"].astype(str)
    daily["date"] = daily["date"].astype(str)

    merged = pd.merge(fb, daily, on="date", how="inner")
    if len(merged) == 0:
        raise ValueError("反馈日期与 daily_features 没有交集，无法更新个人模型")

    updates = []

    # Stress personal model
    stress_rows = merged.dropna(subset=["user_stress_label"]).copy()
    if len(stress_rows) > 0:
        Xs = build_stress_personal_features(stress_rows)
        Xs = fillna_with_mean(Xs)
        ys = stress_rows["user_stress_label"].astype(int)

        stress_path = personal_dir / f"{args.user_id}_stress_personal.pkl"
        stress_bundle = load_or_init_bundle(stress_path, Xs.columns.tolist())
        stress_bundle, n_new = partial_update_bundle(stress_bundle, Xs, ys, stress_rows["date"])
        joblib.dump(stress_bundle, stress_path)
        updates.append(("stress", n_new, stress_path))

    # Mood personal model
    mood_rows = merged.dropna(subset=["user_mood_label"]).copy()
    if len(mood_rows) > 0:
        Xm = build_mood_personal_features(mood_rows, mood_rows)
        Xm = fillna_with_mean(Xm)
        ym = mood_rows["user_mood_label"].astype(int)

        mood_path = personal_dir / f"{args.user_id}_mood_personal.pkl"
        mood_bundle = load_or_init_bundle(mood_path, Xm.columns.tolist())
        mood_bundle, n_new = partial_update_bundle(mood_bundle, Xm, ym, mood_rows["date"])
        joblib.dump(mood_bundle, mood_path)
        updates.append(("mood", n_new, mood_path))

    if not updates:
        print("没有可更新的标签（需要 user_stress_label 或 user_mood_label）")
        return

    print(f"用户 {args.user_id} 个人模型更新完成")
    for model_type, n_new, path in updates:
        print(f"- {model_type}: 新增训练样本 {n_new} 条, 模型路径: {path}")


if __name__ == "__main__":
    main()
