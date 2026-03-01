# Wellness Backend (Organized)

## Directory Layout

- `src/`: all Python source code
  - `api_server.py`: FastAPI backend
  - `llm_client.py`: real LLM integration
  - `train_models.py`: train global models
  - `predict.py`: stress/mood inference
  - `collect_feedback.py`: append user feedback
  - `update_personal_model.py`: incremental personalization
  - `retrain_global.py`: periodic global retraining
  - `clean_lifesnaps.py`, `clean_wesad.py`, `extract_apple_watch_features.py`: data prep
- `data/`
  - `raw/apple_health_export/`: Apple export raw files
  - `processed/`: feature and prediction CSV outputs
  - `feedback/user_feedback.csv`: user labels and mood text
- `models/`
  - `latest/`: current online models
  - `global/`: versioned global models
  - `personal/`: per-user personalized models
- `docs/`: usage docs
- `scripts/`: helper scripts
- `daily_run.sh`: one-command daily pipeline

## Quick Start

```bash
cd wellness_backend
source ../myenv/bin/activate
pip install -r requirements-api.txt
export OPENAI_API_KEY="your_key_here"
uvicorn api_server:app --app-dir src --host 0.0.0.0 --port 8000 --reload
```

## Smoke Test

```bash
./scripts/smoke_test_api.sh
```
