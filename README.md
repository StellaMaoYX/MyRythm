# Rhythm

The Problem Is Measurable. The Solution Is On Her Wrist.

Rhythm is an AI system for women-centered stress and burnout prevention, built with two coordinated intelligence layers:
- `ML` models detect physiological drift early from HRV, RHR, sleep, temperature, and activity signals.
- `LLM` coaching translates those predictions into one warm, specific, actionable daily message.

This repository contains the full product stack:
- `rhythm_app`: frontend (React + Vite)
- `wellness_backend`: backend (FastAPI + ML + LLM orchestration)

## Why This Product

### The Burnout Gap
- Women report burnout at significantly higher rates than men, and the gap is still widening.
- This is not a motivation problem; it is a measurable and predictable population-level pattern.

### Physical and Economic Cost
- Chronic burnout is linked to cardiovascular, immune, sleep, and reproductive health consequences.
- For employers, it shows up as productivity loss and stress-related leave costs.

### The Biology Gap in Current Apps
- Cycle-phase-related changes in HRV, RHR, and sleep are often treated as anomalies by generic apps.
- Fixed thresholds misclassify normal biology; personalized modeling is required to separate expected variation from true risk drift.

### Why Two AI Systems
- ML alone gives a score, but not trusted daily guidance.
- LLM alone cannot reliably detect physiological drift from wearable signals.
- Rhythm combines both: one model sees what is happening, the other explains what it means.

## What Rhythm Provides

- `Prediction`: detects drift 2-3 days before subjective exhaustion spikes.
- `Prevention`: turns signals into concrete action instead of dashboard anxiety.
- `Personalization`: continuously adapts to each user through feedback-driven incremental learning.

## Built With

- `Frontend`: React, Vite, TypeScript, npm
- `Backend`: Python 3.11, FastAPI, Uvicorn, Pydantic
- `ML`: scikit-learn, XGBoost, pandas, NumPy, joblib
- `Cloud/Deployment`: Render (backend service), Vercel-compatible frontend deployment
- `LLM APIs`: Anthropic API, OpenAI API
- `Data`: CSV-based feature/feedback pipeline + serialized model artifacts (`.pkl`)

### 3-Model Intelligence Stack

- `Model 1 - Check-in Understanding`: LLM extracts structured emotion/life-event context from user check-ins (`/checkin`)
- `Model 2 - Daily Prediction`: stress + mood ML models infer daily risk from wearable signals, with global + personal blending (`/predict/daily`)
- `Model 3 - Coach Response`: LLM turns check-in + prediction outputs into personalized daily guidance (`/coach/chat`)

## System Architecture

```text
[Apple Watch / Daily Signals + User Check-in]
                    |
                    v
          Frontend (rhythm_app)
                    |
                    v
        FastAPI Backend (wellness_backend)
          |         |                 |
          |         |                 +--> LLM Coach (Anthropic/OpenAI)
          |         |
          |         +--> Check-in Structuring (/checkin)
          |
          +--> Prediction Engine (/predict/daily)
                - Global models (models/latest)
                - Personal models (models/personal)
                - Blended probabilities

Feedback loop:
Frontend -> /feedback -> personal model update (/train/personal or daily_run.sh)
```

## Repository Structure

```text
.
├── rhythm_app/                 # Frontend
│   ├── src/app/components/     # Pages (CheckIn, Insights, Chat)
│   ├── src/app/lib/api.ts      # Backend API client
│   └── .env.example            # VITE_API_BASE_URL
├── wellness_backend/           # Backend + ML + LLM
│   ├── src/api_server.py       # API entrypoint
│   ├── src/predict.py          # Stress/mood prediction + blending
│   ├── src/update_personal_model.py
│   ├── src/llm_client.py       # Anthropic/OpenAI client wrapper
│   ├── daily_run.sh            # Daily predict + feedback + personalization update
│   ├── scripts/smoke_test_api.sh
│   └── render.yaml             # Render deployment config
└── README.md
```

## Local Quick Start

### 1) Prerequisites
- Python `3.11+` (Render is set to `3.11.9`)
- Node.js `18+`
- npm

### 2) Start Backend

```bash
cd wellness_backend
source ../myenv/bin/activate
pip install -r requirements-api.txt

# Choose one provider
export LLM_PROVIDER=anthropic
export ANTHROPIC_API_KEY="your_key"
# or
# export LLM_PROVIDER=openai
# export OPENAI_API_KEY="your_key"

# Optional flags
export USE_REAL_LLM=1
export LLM_STRICT=1
# Optional model override
# export LLM_MODEL="claude-haiku-4-5-20251001"

uvicorn api_server:app --app-dir src --host 0.0.0.0 --port 8000 --reload
```

Health check:

```bash
curl http://127.0.0.1:8000/health
```

### 3) Start Frontend

```bash
cd rhythm_app
cp .env.example .env
# Update as needed
# VITE_API_BASE_URL=http://127.0.0.1:8000

npm install
npm run dev
```

## End-to-End Product Flow

1. User submits emotional check-in -> `POST /checkin`
2. Frontend sends wearable signals + check-in summary -> `POST /predict/daily`
3. Frontend requests daily guidance -> `POST /coach/chat`
4. User submits labels/feedback -> `POST /feedback`
5. Personal model updates daily/weekly -> `POST /train/personal` or scripts

Backend smoke test:

```bash
cd wellness_backend
./scripts/smoke_test_api.sh http://127.0.0.1:8000
```

## API Overview

- `GET /health`
- `POST /checkin` (uses real LLM when `USE_REAL_LLM=1`)
- `POST /predict` (batch feature prediction)
- `POST /predict/daily` (single-day orchestration endpoint)
- `POST /coach/chat` (LLM-generated explanation + suggestions)
- `POST /feedback` (stores user labels and mood text)
- `POST /train/personal` (incremental per-user model update)
- `POST /train/weekly` (weekly alias)

More details:
- `wellness_backend/docs/api_usage.md`
- `wellness_backend/docs/personalization.md`

## Personalization Learning Loop

### Daily one-command pipeline

```bash
cd wellness_backend
./daily_run.sh --user-id u_demo --date 2026-03-01 --skip-feedback
```

With feedback (recommended):

```bash
cd wellness_backend
./daily_run.sh \
  --user-id u_demo \
  --date 2026-03-01 \
  --stress-label 2 \
  --mood-label 0 \
  --mood-text "Feeling anxious today, heavy workload"
```

The script runs three steps:
1. Prediction (`src/predict.py`)
2. Feedback append (`src/collect_feedback.py`)
3. Incremental personal model update (`src/update_personal_model.py`)

## Deployment

### Backend (Render)
Config file: `wellness_backend/render.yaml`

Current config highlights:
- service name: `rhythm-backend`
- build command: `pip install -r requirements-api.txt`
- start command: `uvicorn api_server:app --app-dir src --host 0.0.0.0 --port $PORT`
- default env vars:
  - `LLM_PROVIDER=anthropic`
  - `LLM_MODEL=claude-haiku-4-5-20251001`
  - `USE_REAL_LLM=1`
  - `LLM_STRICT=1`
  - `PYTHON_VERSION=3.11.9`

You still need to set secrets in Render:
- `ANTHROPIC_API_KEY` or `OPENAI_API_KEY`

### Frontend Deployment
`rhythm_app` can be deployed separately (for example, Vercel). Set:
- `VITE_API_BASE_URL=https://<your-backend-domain>`

## Current Defaults (Known)

- Demo user ID is hardcoded to `u_demo` in `rhythm_app/src/app/components/check-in-page.tsx`.
- Frontend stores latest session payload in localStorage key `rhythm_session_state`.
- Backend CORS is currently open (`allow_origins=["*"]`) for development speed.

## Troubleshooting

- `502 LLM ... failed`
  - Verify provider and API key environment variables.
  - If you want graceful fallback behavior, set `LLM_STRICT=0`.

- `Cannot run mood prediction with provided fields`
  - Payload is missing mood model features, or no usable personal mood model exists.

- Frontend cannot reach backend
  - Check `VITE_API_BASE_URL`.
  - Confirm `GET /health` first.

## Suggested Next Additions

1. Add a demo script section with screenshots/GIF for pitch flow.
2. Add offline model evaluation metrics (accuracy/F1/AUC).
3. Add a data privacy and compliance section (collection, storage, anonymization, retention).
