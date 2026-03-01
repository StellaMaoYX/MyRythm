#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${1:-http://127.0.0.1:8000}"

echo "== health =="
curl -s "$BASE_URL/health"; echo

echo "== checkin =="
CHECKIN_JSON='{
  "user_id": "u_demo",
  "date": "2026-03-01",
  "mood_text": "今天有点焦虑但还能处理",
  "life_event_text": "本周有演讲和deadline",
  "life_events": ["周三演讲彩排", "周五项目提交"]
}'
CHECKIN_RESP=$(curl -s -X POST "$BASE_URL/checkin" -H 'Content-Type: application/json' -d "$CHECKIN_JSON")
echo "$CHECKIN_RESP"

echo "== predict/daily =="
PRED_JSON='{
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
}'
PRED_RESP=$(curl -s -X POST "$BASE_URL/predict/daily" -H 'Content-Type: application/json' -d "$PRED_JSON")
echo "$PRED_RESP"

echo "== coach/chat =="
CHAT_JSON='{
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
}'
curl -s -X POST "$BASE_URL/coach/chat" -H 'Content-Type: application/json' -d "$CHAT_JSON"; echo
