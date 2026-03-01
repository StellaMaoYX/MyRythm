import argparse
from datetime import datetime
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from xgboost import XGBClassifier
from sklearn.model_selection import StratifiedKFold, cross_val_score

BASE_DIR = Path(__file__).resolve().parent.parent


def train_global_stress(wesad_path: Path, lifesnaps_path: Path):
    wesad = pd.read_csv(wesad_path)
    lifesnaps = pd.read_csv(lifesnaps_path)

    wesad_stress = pd.DataFrame(
        {
            "hr_mean": wesad["bvp_mean"],
            "hr_std": wesad["bvp_std"],
            "hrv_mean": wesad["bvp_std"],
            "temp_mean": wesad["temp_mean"],
            "temp_std": wesad["temp_std"],
            "acc_mean": wesad["acc_mean"],
            "stress_label": wesad["stress_label"] - 1,
        }
    )
    label_remap_wesad = {0: 1, 1: 2, 2: 0}
    wesad_stress["stress_label"] = wesad_stress["stress_label"].map(label_remap_wesad)

    lifesnaps_stress = pd.DataFrame(
        {
            "hr_mean": lifesnaps["bpm"],
            "hr_std": np.nan,
            "hrv_mean": lifesnaps["rmssd"],
            "temp_mean": lifesnaps["nightly_temperature"],
            "temp_std": np.nan,
            "acc_mean": lifesnaps["steps"] / 1000,
            "stress_label": lifesnaps["stress_label"],
        }
    )

    combined = pd.concat([wesad_stress, lifesnaps_stress], ignore_index=True)
    features = ["hr_mean", "hr_std", "hrv_mean", "temp_mean", "temp_std", "acc_mean"]
    for col in features:
        combined[col] = combined[col].fillna(combined[col].mean())

    X = combined[features]
    y = combined["stress_label"].astype(int)

    model = XGBClassifier(
        n_estimators=200,
        max_depth=6,
        learning_rate=0.1,
        scale_pos_weight=1,
        use_label_encoder=False,
        eval_metric="mlogloss",
        verbosity=0,
    )
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    score = cross_val_score(model, X, y, cv=cv, scoring="accuracy")
    model.fit(X, y)
    return model, float(score.mean()), float(score.std())


def train_global_mood(lifesnaps_path: Path):
    lifesnaps = pd.read_csv(lifesnaps_path)
    mood_features = [
        "resting_hr",
        "bpm",
        "rmssd",
        "sleep_hours",
        "sleep_efficiency",
        "sleep_deep_ratio",
        "sleep_rem_ratio",
        "steps",
        "very_active_minutes",
        "sedentary_minutes",
        "stress_score",
    ]
    available = [f for f in mood_features if f in lifesnaps.columns]
    df = lifesnaps[available + ["mood_label"]].dropna()

    X = df[available]
    y = df["mood_label"].astype(int)

    model = XGBClassifier(
        n_estimators=200,
        max_depth=6,
        learning_rate=0.1,
        use_label_encoder=False,
        eval_metric="mlogloss",
        verbosity=0,
    )
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    score = cross_val_score(model, X, y, cv=cv, scoring="accuracy")
    model.fit(X, y)
    return model, float(score.mean()), float(score.std())


def main() -> None:
    parser = argparse.ArgumentParser(description="Retrain global stress/mood models and version them.")
    parser.add_argument("--wesad", default=str(BASE_DIR / "data" / "processed" / "wesad_features.csv"))
    parser.add_argument("--lifesnaps", default=str(BASE_DIR / "data" / "processed" / "lifesnaps_features.csv"))
    parser.add_argument("--outdir", default=str(BASE_DIR / "models" / "global"))
    parser.add_argument("--update-latest", action="store_true", help="Also overwrite models/latest stress/mood models")
    args = parser.parse_args()

    wesad_path = Path(args.wesad)
    lifesnaps_path = Path(args.lifesnaps)
    outdir = Path(args.outdir)
    outdir.mkdir(parents=True, exist_ok=True)

    if not wesad_path.exists() or not lifesnaps_path.exists():
        raise FileNotFoundError("WESAD 或 LifeSnaps 特征文件不存在")

    stress_model, stress_mean, stress_std = train_global_stress(wesad_path, lifesnaps_path)
    mood_model, mood_mean, mood_std = train_global_mood(lifesnaps_path)

    ts = datetime.now().strftime("%Y%m%d_%H%M%S")
    stress_version_path = outdir / f"stress_model_{ts}.pkl"
    mood_version_path = outdir / f"mood_model_{ts}.pkl"

    joblib.dump(stress_model, stress_version_path)
    joblib.dump(mood_model, mood_version_path)

    print("全局模型重训完成")
    print(f"- stress cv acc: {stress_mean:.3f} +/- {stress_std:.3f}")
    print(f"- mood   cv acc: {mood_mean:.3f} +/- {mood_std:.3f}")
    print(f"- stress version: {stress_version_path}")
    print(f"- mood version:   {mood_version_path}")

    if args.update_latest:
        latest_dir = BASE_DIR / "models" / "latest"
        latest_dir.mkdir(parents=True, exist_ok=True)
        joblib.dump(stress_model, latest_dir / "stress_model.pkl")
        joblib.dump(mood_model, latest_dir / "mood_model.pkl")
        print(f"- 已更新最新模型目录: {latest_dir}")


if __name__ == "__main__":
    main()
