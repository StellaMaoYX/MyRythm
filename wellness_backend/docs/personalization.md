# Personalized Continuous Learning Workflow

## 1) Initial global models

```bash
source ../myenv/bin/activate
python src/train_models.py
```

## One-command daily run

```bash
./daily_run.sh --user-id u_demo --date 2026-02-28 --skip-feedback
```

With feedback:

```bash
./daily_run.sh \
  --user-id u_demo \
  --date 2026-02-28 \
  --stress-label 2 \
  --mood-label 0 \
  --mood-text "今天很焦虑 很有压力"
```

## 2) Daily prediction (global + personal blend)

```bash
python src/predict.py \
  --input data/processed/daily_features.csv \
  --predict-mood \
  --user-id u_demo \
  --use-personal \
  --output data/processed/predictions_personal_u_demo.csv
```

Notes:
- If personal model exists, output columns `stress_model_source` / `mood_model_source` become `blended` or `personal`.
- If not, model source is `global`.

## 3) Collect user feedback every day

```bash
python src/collect_feedback.py \
  --user-id u_demo \
  --date 2026-02-28 \
  --stress-label 2 \
  --mood-label 0 \
  --mood-text "今天很焦虑 很有压力"
```

Feedback file: `data/feedback/user_feedback.csv`

## 4) Incremental update personal models

```bash
python src/update_personal_model.py --user-id u_demo
```

Outputs:
- `models/personal/u_demo_stress_personal.pkl`
- `models/personal/u_demo_mood_personal.pkl`

Model update is incremental:
- Uses `partial_fit`
- Tracks trained dates and skips repeated dates

## 5) Periodic global retraining (weekly/monthly)

```bash
python src/retrain_global.py
```

Versioned outputs:
- `models/global/stress_model_YYYYMMDD_HHMMSS.pkl`
- `models/global/mood_model_YYYYMMDD_HHMMSS.pkl`

Optional overwrite latest root models:

```bash
python src/retrain_global.py --update-latest
```
