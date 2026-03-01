# API Integration Guide

## Start

```bash
source ../myenv/bin/activate
pip install -r requirements-api.txt
export ANTHROPIC_API_KEY="your_claude_key_here"
# optional:
# export LLM_PROVIDER=anthropic
# export LLM_MODEL="claude-3-5-sonnet-latest"
# export USE_REAL_LLM=1
# export LLM_STRICT=1
uvicorn api_server:app --app-dir src --host 0.0.0.0 --port 8000 --reload
```

## Core Endpoints for 3-model orchestration

### 1) Model1 Check-in

`POST /checkin`

This endpoint now uses real LLM extraction when `USE_REAL_LLM=1`.

```json
{
  "user_id": "u_demo",
  "date": "2026-03-01",
  "mood_text": "今天有点焦虑，但还可以",
  "life_event_text": "下周有演讲和项目截止",
  "life_events": ["周二组会", "周五deadline"]
}
```

### 2) Model2 Daily Predict

`POST /predict/daily`

```json
{
  "user_id": "u_demo",
  "date": "2026-03-01",
  "use_personal": true,
  "predict_mood": true,
  "global_weight": 0.7,
  "checkin": {
    "emotion_summary": {"sentiment_score": -1, "valence": "negative"},
    "life_events_summary": {"high_impact_count": 1}
  },
  "iwatch_features": {
    "hr_mean": 74,
    "hr_std": 7,
    "hrv_mean": 34,
    "wrist_temp": 34.5,
    "steps": 5400,
    "sleep_hours": 6.3,
    "resting_hr": 61,
    "respiratory_rate": 15
  }
}
```

### 3) Model3 Coach Chat

`POST /coach/chat`

This endpoint now uses real LLM generation when `USE_REAL_LLM=1`.

```json
{
  "user_id": "u_demo",
  "date": "2026-03-01",
  "checkin": {
    "emotion_summary": {"sentiment_score": -1, "valence": "negative"},
    "life_events_summary": {"high_impact_count": 1}
  },
  "prediction": {
    "stress_pred_label": "有压力",
    "mood_pred_label": "中"
  },
  "calendar_events": ["10:00 项目会议", "15:00 演讲彩排"],
  "message": "我今天应该怎么安排任务？",
  "chat_history": []
}
```

## Existing Endpoints

- `POST /predict`
- `POST /feedback`
- `POST /train/personal`
- `POST /train/weekly` (alias for weekly update)

## Recommended app flow

1. Frontend submits check-in text to `/checkin`.
2. Frontend calls `/predict/daily` with checkin summary + iWatch features.
3. Frontend calls `/coach/chat` with checkin + prediction + calendar.
4. User submits labels to `/feedback`.
5. Weekly run `/train/weekly` for personalization update.
