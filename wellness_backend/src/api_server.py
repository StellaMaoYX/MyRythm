import os
from pathlib import Path
from typing import Any, Optional

import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from collect_feedback import simple_sentiment_score
from llm_client import llm_checkin_extract, llm_coach_generate
from predict import (
    MOOD_LABEL_MAP,
    STRESS_LABEL_MAP,
    blend_prob,
    build_mood_features,
    build_personal_features,
    build_stress_features,
)
from update_personal_model import (
    build_mood_personal_features,
    build_stress_personal_features,
    fillna_with_mean,
    load_or_init_bundle,
    partial_update_bundle,
)


APP_TITLE = "Personal Health Model API"
BASE_DIR = Path(__file__).resolve().parent.parent
DEFAULT_STRESS_MODEL = BASE_DIR / "models" / "latest" / "stress_model.pkl"
DEFAULT_MOOD_MODEL = BASE_DIR / "models" / "latest" / "mood_model.pkl"
DEFAULT_PERSONAL_DIR = BASE_DIR / "models" / "personal"
DEFAULT_FEEDBACK_CSV = BASE_DIR / "data" / "feedback" / "user_feedback.csv"
DEFAULT_DAILY_FEATURES_CSV = BASE_DIR / "data" / "processed" / "daily_features.csv"
USE_REAL_LLM = os.getenv("USE_REAL_LLM", "1") == "1"
LLM_STRICT = os.getenv("LLM_STRICT", "1") == "1"


class PredictRequest(BaseModel):
    rows: list[dict[str, Any]] = Field(..., description="Feature rows, one row per day")
    user_id: Optional[str] = None
    use_personal: bool = True
    predict_mood: bool = True
    global_weight: float = 0.7


class FeedbackRequest(BaseModel):
    user_id: str
    date: str
    stress_label: Optional[int] = Field(None, ge=0, le=2)
    mood_label: Optional[int] = Field(None, ge=0, le=2)
    mood_text: str = ""
    sentiment_score: Optional[float] = None


class TrainPersonalRequest(BaseModel):
    user_id: str
    daily_features_path: str = str(DEFAULT_DAILY_FEATURES_CSV)


class CheckinRequest(BaseModel):
    user_id: str
    date: str
    mood_text: str = ""
    life_event_text: str = ""
    life_events: list[str] = Field(default_factory=list)


class DailyPredictRequest(BaseModel):
    user_id: str
    date: str
    iwatch_features: dict[str, Any]
    checkin: Optional[dict[str, Any]] = None
    use_personal: bool = True
    predict_mood: bool = True
    global_weight: float = 0.7


class CoachChatRequest(BaseModel):
    user_id: str
    date: str
    checkin: dict[str, Any]
    prediction: dict[str, Any]
    calendar_events: list[str] = Field(default_factory=list)
    message: str = ""
    chat_history: list[dict[str, str]] = Field(default_factory=list)


app = FastAPI(title=APP_TITLE)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

POSITIVE_EMOTION_WORDS = {"happy", "calm", "good", "great", "relaxed", "开心", "放松", "平静", "不错", "很好"}
NEGATIVE_EMOTION_WORDS = {"sad", "anxious", "stressed", "angry", "tired", "焦虑", "压力", "难过", "生气", "疲惫"}
HIGH_IMPACT_EVENT_WORDS = {
    "exam",
    "interview",
    "deadline",
    "presentation",
    "wedding",
    "travel",
    "move",
    "layoff",
    "breakup",
    "考试",
    "面试",
    "截止",
    "演讲",
    "搬家",
    "结婚",
    "分手",
    "裁员",
}


def _load_global_models() -> tuple[Any, Any]:
    if not DEFAULT_STRESS_MODEL.exists():
        raise HTTPException(status_code=500, detail=f"Missing stress model: {DEFAULT_STRESS_MODEL}")

    stress_model = joblib.load(DEFAULT_STRESS_MODEL)
    mood_model = joblib.load(DEFAULT_MOOD_MODEL) if DEFAULT_MOOD_MODEL.exists() else None
    return stress_model, mood_model


def _append_feedback(req: FeedbackRequest) -> pd.DataFrame:
    DEFAULT_FEEDBACK_CSV.parent.mkdir(parents=True, exist_ok=True)

    if req.stress_label is None and req.mood_label is None:
        raise HTTPException(status_code=400, detail="stress_label or mood_label is required")

    mood_text = req.mood_text.strip()
    sentiment_score = req.sentiment_score if req.sentiment_score is not None else simple_sentiment_score(mood_text)

    row = pd.DataFrame(
        [
            {
                "user_id": req.user_id,
                "date": req.date,
                "user_stress_label": req.stress_label,
                "user_mood_label": req.mood_label,
                "mood_text": mood_text,
                "sentiment_score": sentiment_score,
                "updated_at": pd.Timestamp.now().isoformat(),
            }
        ]
    )

    if DEFAULT_FEEDBACK_CSV.exists():
        df = pd.read_csv(DEFAULT_FEEDBACK_CSV)
        df = pd.concat([df, row], ignore_index=True)
        df = df.sort_values("updated_at").drop_duplicates(subset=["user_id", "date"], keep="last")
    else:
        df = row

    df = df.sort_values(["user_id", "date"]).reset_index(drop=True)
    df.to_csv(DEFAULT_FEEDBACK_CSV, index=False)
    return df


def _analyze_checkin(req: CheckinRequest) -> dict[str, Any]:
    mood_text = req.mood_text.strip()
    mood_text_l = mood_text.lower()
    sentiment_score = simple_sentiment_score(mood_text)

    emotion_tags: list[str] = []
    if any(w in mood_text_l for w in POSITIVE_EMOTION_WORDS):
        emotion_tags.append("positive")
    if any(w in mood_text_l for w in NEGATIVE_EMOTION_WORDS):
        emotion_tags.append("negative")
    if not emotion_tags:
        emotion_tags.append("neutral")

    valence = "neutral"
    if sentiment_score > 0:
        valence = "positive"
    elif sentiment_score < 0:
        valence = "negative"

    event_texts = [x for x in req.life_events if x.strip()]
    if req.life_event_text.strip():
        event_texts.append(req.life_event_text.strip())

    structured_events = []
    for text in event_texts:
        text_l = text.lower()
        impact_score = 1
        if any(w in text_l for w in HIGH_IMPACT_EVENT_WORDS):
            impact_score = 3
        elif len(text) > 30:
            impact_score = 2
        structured_events.append({"text": text, "impact_score": impact_score})

    return {
        "user_id": req.user_id,
        "date": req.date,
        "emotion_summary": {
            "raw_text": mood_text,
            "sentiment_score": sentiment_score,
            "valence": valence,
            "emotion_tags": emotion_tags,
        },
        "life_events_summary": {
            "raw_text": req.life_event_text,
            "events": structured_events,
            "high_impact_count": int(sum(1 for e in structured_events if e["impact_score"] >= 3)),
        },
    }


def _predict_internal(req: PredictRequest) -> list[dict[str, Any]]:
    if not (0.0 <= req.global_weight <= 1.0):
        raise HTTPException(status_code=400, detail="global_weight must be in [0,1]")
    if not req.rows:
        raise HTTPException(status_code=400, detail="rows is empty")

    df = pd.DataFrame(req.rows)
    stress_model, mood_model = _load_global_models()

    stress_features = [
        str(x)
        for x in getattr(
            stress_model,
            "feature_names_in_",
            ["hr_mean", "hr_std", "hrv_mean", "temp_mean", "temp_std", "acc_mean"],
        )
    ]

    X_stress = build_stress_features(df, stress_features)
    stress_prob = stress_model.predict_proba(X_stress)
    stress_source = "global"

    if req.use_personal and req.user_id:
        p_path = DEFAULT_PERSONAL_DIR / f"{req.user_id}_stress_personal.pkl"
        if p_path.exists():
            bundle = joblib.load(p_path)
            if bundle.get("initialized", False):
                p_features = [str(x) for x in bundle["feature_names"]]
                Xp = build_personal_features(df, p_features)
                Xp_scaled = bundle["scaler"].transform(Xp)
                p_prob = bundle["model"].predict_proba(Xp_scaled)
                stress_prob = blend_prob(stress_prob, p_prob, req.global_weight)
                stress_source = "blended"

    stress_pred = stress_prob.argmax(axis=1)

    mood_pred = None
    mood_prob = None
    mood_source = None

    if req.predict_mood:
        if mood_model is not None:
            mood_features = [str(x) for x in getattr(mood_model, "feature_names_in_", [])]
            if mood_features:
                try:
                    X_mood = build_mood_features(df, mood_features)
                    mood_prob = mood_model.predict_proba(X_mood)
                    mood_source = "global"
                except ValueError:
                    mood_prob = None

        if req.use_personal and req.user_id:
            p_mood = DEFAULT_PERSONAL_DIR / f"{req.user_id}_mood_personal.pkl"
            if p_mood.exists():
                mb = joblib.load(p_mood)
                if mb.get("initialized", False):
                    m_features = [str(x) for x in mb["feature_names"]]
                    Xm = build_personal_features(df, m_features)
                    Xm_scaled = mb["scaler"].transform(Xm)
                    p_mood_prob = mb["model"].predict_proba(Xm_scaled)
                    if mood_prob is None:
                        mood_prob = p_mood_prob
                        mood_source = "personal"
                    else:
                        mood_prob = blend_prob(mood_prob, p_mood_prob, req.global_weight)
                        mood_source = "blended"

        if mood_prob is None:
            raise HTTPException(status_code=400, detail="Cannot run mood prediction with provided fields")

        mood_pred = mood_prob.argmax(axis=1)

    results: list[dict[str, Any]] = []
    for idx in range(len(df)):
        item: dict[str, Any] = {
            "stress_pred_code": int(stress_pred[idx]),
            "stress_pred_label": STRESS_LABEL_MAP[int(stress_pred[idx])],
            "p_relax": float(stress_prob[idx][0]),
            "p_normal": float(stress_prob[idx][1]),
            "p_stress": float(stress_prob[idx][2]),
            "stress_model_source": stress_source,
        }
        if "date" in df.columns:
            item["date"] = str(df.iloc[idx]["date"])

        if req.predict_mood and mood_pred is not None and mood_prob is not None:
            item.update(
                {
                    "mood_pred_code": int(mood_pred[idx]),
                    "mood_pred_label": MOOD_LABEL_MAP[int(mood_pred[idx])],
                    "p_mood_bad": float(mood_prob[idx][0]),
                    "p_mood_mid": float(mood_prob[idx][1]),
                    "p_mood_good": float(mood_prob[idx][2]),
                    "mood_model_source": mood_source,
                }
            )

        results.append(item)

    return results


def _build_row_for_daily_predict(req: DailyPredictRequest) -> dict[str, Any]:
    row = dict(req.iwatch_features)
    row["date"] = req.date

    checkin = req.checkin or {}
    emotion_summary = checkin.get("emotion_summary", {})
    life_events_summary = checkin.get("life_events_summary", {})

    sentiment_score = emotion_summary.get("sentiment_score")
    if sentiment_score is not None:
        row["sentiment_score"] = sentiment_score

    row["high_impact_event_count"] = life_events_summary.get("high_impact_count", 0)
    return row


def _train_personal_internal(req: TrainPersonalRequest) -> dict[str, Any]:
    feedback_path = DEFAULT_FEEDBACK_CSV
    daily_path = Path(req.daily_features_path)
    personal_dir = DEFAULT_PERSONAL_DIR
    personal_dir.mkdir(parents=True, exist_ok=True)

    if not feedback_path.exists():
        raise HTTPException(status_code=404, detail=f"Feedback file not found: {feedback_path}")
    if not daily_path.exists():
        raise HTTPException(status_code=404, detail=f"Daily features file not found: {daily_path}")

    fb = pd.read_csv(feedback_path)
    fb = fb[fb["user_id"].astype(str) == str(req.user_id)].copy()
    if len(fb) == 0:
        raise HTTPException(status_code=404, detail=f"No feedback rows for user {req.user_id}")

    daily = pd.read_csv(daily_path)
    if "date" not in daily.columns:
        raise HTTPException(status_code=400, detail="daily_features missing 'date' column")

    fb["date"] = fb["date"].astype(str)
    daily["date"] = daily["date"].astype(str)

    merged = pd.merge(fb, daily, on="date", how="inner")
    if len(merged) == 0:
        raise HTTPException(status_code=400, detail="No overlap between feedback dates and daily features")

    updated: dict[str, Any] = {"user_id": req.user_id, "updates": []}

    stress_rows = merged.dropna(subset=["user_stress_label"]).copy()
    if len(stress_rows) > 0:
        Xs = fillna_with_mean(build_stress_personal_features(stress_rows))
        ys = stress_rows["user_stress_label"].astype(int)
        stress_path = personal_dir / f"{req.user_id}_stress_personal.pkl"
        bundle = load_or_init_bundle(stress_path, Xs.columns.tolist())
        bundle, n_new = partial_update_bundle(bundle, Xs, ys, stress_rows["date"])
        joblib.dump(bundle, stress_path)
        updated["updates"].append(
            {"model": "stress", "new_samples": int(n_new), "model_path": str(stress_path)}
        )

    mood_rows = merged.dropna(subset=["user_mood_label"]).copy()
    if len(mood_rows) > 0:
        Xm = fillna_with_mean(build_mood_personal_features(mood_rows, mood_rows))
        ym = mood_rows["user_mood_label"].astype(int)
        mood_path = personal_dir / f"{req.user_id}_mood_personal.pkl"
        bundle = load_or_init_bundle(mood_path, Xm.columns.tolist())
        bundle, n_new = partial_update_bundle(bundle, Xm, ym, mood_rows["date"])
        joblib.dump(bundle, mood_path)
        updated["updates"].append(
            {"model": "mood", "new_samples": int(n_new), "model_path": str(mood_path)}
        )

    if not updated["updates"]:
        raise HTTPException(status_code=400, detail="No valid stress/mood labels to train")

    return updated


def _build_coach_content(req: CoachChatRequest) -> dict[str, Any]:
    pred = req.prediction or {}
    checkin = req.checkin or {}
    emotion_summary = checkin.get("emotion_summary", {})
    events_summary = checkin.get("life_events_summary", {})

    stress_label = pred.get("stress_pred_label", "未知")
    mood_label = pred.get("mood_pred_label", "未知")
    sentiment = emotion_summary.get("sentiment_score", 0)
    valence = emotion_summary.get("valence", "neutral")
    high_impact_count = events_summary.get("high_impact_count", 0)

    explanation = (
        f"今天的综合预测为压力等级「{stress_label}」、情绪等级「{mood_label}」。"
        f"你的check-in情绪倾向是{valence}（score={sentiment}），"
        f"并识别到{high_impact_count}个高影响事件。"
    )

    upcoming = req.calendar_events[:3]
    if upcoming:
        anticipation = "结合你的日程，接下来重点关注：" + "；".join(upcoming) + "。"
    else:
        anticipation = "今天日程事件较少，建议保持稳定节奏，避免突发任务堆积。"

    prepare_suggestion = [
        "上午先完成最重要的一件事，减少认知负担。",
        "安排10-15分钟低强度活动（散步/拉伸）稳定生理状态。",
        "晚上固定时间复盘情绪与事件，继续提供反馈以优化个性化模型。",
    ]

    if stress_label == "有压力":
        prepare_suggestion[0] = "把任务拆成30分钟的小块，并预留中间休息。"
    if mood_label == "差":
        prepare_suggestion[1] = "优先保证睡眠和补水，今天避免新增高风险承诺。"

    user_msg = req.message.strip()
    if user_msg:
        assistant_reply = (
            f"收到你的问题：「{user_msg}」。"
            f"基于当前生理与情绪信号，我建议先执行第一条准备建议，再根据下午状态调整。"
        )
    else:
        assistant_reply = "如果你愿意，我可以继续把今天任务按压力负荷拆成可执行时间块。"

    return {
        "explanation": explanation,
        "anticipation": anticipation,
        "prepare_suggestion": prepare_suggestion,
        "assistant_reply": assistant_reply,
    }


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/predict")
def predict(req: PredictRequest) -> dict[str, Any]:
    return {"count": len(req.rows), "results": _predict_internal(req)}


@app.post("/checkin")
def checkin(req: CheckinRequest) -> dict[str, Any]:
    if USE_REAL_LLM:
        try:
            return llm_checkin_extract(req.model_dump())
        except Exception as exc:
            if LLM_STRICT:
                raise HTTPException(status_code=502, detail=f"LLM checkin failed: {exc}") from exc
    return _analyze_checkin(req)


@app.post("/predict/daily")
def predict_daily(req: DailyPredictRequest) -> dict[str, Any]:
    row = _build_row_for_daily_predict(req)
    pred_req = PredictRequest(
        rows=[row],
        user_id=req.user_id,
        use_personal=req.use_personal,
        predict_mood=req.predict_mood,
        global_weight=req.global_weight,
    )
    result = _predict_internal(pred_req)[0]
    return {"user_id": req.user_id, "date": req.date, "prediction": result}


@app.post("/feedback")
def feedback(req: FeedbackRequest) -> dict[str, Any]:
    df = _append_feedback(req)
    return {"ok": True, "total_rows": int(len(df)), "latest_user": req.user_id, "latest_date": req.date}


@app.post("/train/personal")
def train_personal(req: TrainPersonalRequest) -> dict[str, Any]:
    return _train_personal_internal(req)


@app.post("/train/weekly")
def train_weekly(req: TrainPersonalRequest) -> dict[str, Any]:
    result = _train_personal_internal(req)
    result["schedule"] = "weekly"
    return result


@app.post("/coach/chat")
def coach_chat(req: CoachChatRequest) -> dict[str, Any]:
    if USE_REAL_LLM:
        try:
            return llm_coach_generate(req.model_dump())
        except Exception as exc:
            if LLM_STRICT:
                raise HTTPException(status_code=502, detail=f"LLM coach failed: {exc}") from exc
    return _build_coach_content(req)
