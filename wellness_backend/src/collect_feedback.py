import argparse
from pathlib import Path

import pandas as pd


POSITIVE_WORDS = {
    "happy", "good", "great", "calm", "relaxed", "energized", "fine", "ok", "okay", "peaceful",
    "开心", "放松", "不错", "很好", "平静", "轻松", "有精神",
}
NEGATIVE_WORDS = {
    "sad", "bad", "stressed", "anxious", "tired", "angry", "upset", "panic", "worried",
    "难过", "压力", "焦虑", "累", "生气", "烦", "紧张", "担心",
}
BASE_DIR = Path(__file__).resolve().parent.parent


def simple_sentiment_score(text: str) -> float:
    if not text:
        return 0.0
    text_norm = text.lower()
    tokens = text_norm.replace("，", " ").replace("。", " ").replace(",", " ").replace(".", " ").split()
    pos = sum(1 for t in tokens if t in POSITIVE_WORDS)
    neg = sum(1 for t in tokens if t in NEGATIVE_WORDS)
    # Chinese keywords are often not whitespace-separated; use substring match.
    pos += sum(1 for w in POSITIVE_WORDS if any("\u4e00" <= ch <= "\u9fff" for ch in w) and w in text_norm)
    neg += sum(1 for w in NEGATIVE_WORDS if any("\u4e00" <= ch <= "\u9fff" for ch in w) and w in text_norm)
    score = pos - neg
    if score > 5:
        score = 5
    if score < -5:
        score = -5
    return float(score)


def main() -> None:
    parser = argparse.ArgumentParser(description="Append/update one user daily feedback row.")
    parser.add_argument("--user-id", required=True, help="User id, e.g. u001")
    parser.add_argument("--date", required=True, help="Date in YYYY-MM-DD")
    parser.add_argument("--stress-label", type=int, choices=[0, 1, 2], help="User stress label: 0=放松,1=正常,2=有压力")
    parser.add_argument("--mood-label", type=int, choices=[0, 1, 2], help="User mood label: 0=差,1=中,2=好")
    parser.add_argument("--mood-text", default="", help="Free text about mood")
    parser.add_argument("--sentiment-score", type=float, help="Optional manual sentiment score")
    parser.add_argument("--output", default=str(BASE_DIR / "data" / "feedback" / "user_feedback.csv"), help="Feedback CSV path")
    args = parser.parse_args()

    out_path = Path(args.output)
    out_path.parent.mkdir(parents=True, exist_ok=True)

    if args.stress_label is None and args.mood_label is None:
        raise ValueError("至少提供 --stress-label 或 --mood-label 之一")

    mood_text = args.mood_text.strip()
    sentiment_score = args.sentiment_score if args.sentiment_score is not None else simple_sentiment_score(mood_text)

    row = pd.DataFrame([
        {
            "user_id": args.user_id,
            "date": args.date,
            "user_stress_label": args.stress_label,
            "user_mood_label": args.mood_label,
            "mood_text": mood_text,
            "sentiment_score": sentiment_score,
            "updated_at": pd.Timestamp.now().isoformat(),
        }
    ])

    if out_path.exists():
        df = pd.read_csv(out_path)
        df = pd.concat([df, row], ignore_index=True)
        df = df.sort_values("updated_at").drop_duplicates(subset=["user_id", "date"], keep="last")
    else:
        df = row

    df = df.sort_values(["user_id", "date"]).reset_index(drop=True)
    df.to_csv(out_path, index=False)

    print(f"反馈已保存: {out_path}")
    print(f"当前总记录数: {len(df)}")
    print(df.tail(5).to_string(index=False))


if __name__ == "__main__":
    main()
