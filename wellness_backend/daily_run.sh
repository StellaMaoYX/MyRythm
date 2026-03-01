#!/usr/bin/env bash
set -euo pipefail

# One-command daily pipeline:
# 1) personalized prediction
# 2) optional feedback write
# 3) personal model incremental update (only when feedback is provided)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$SCRIPT_DIR"
ROOT_DIR="$(cd "$PROJECT_DIR/.." && pwd)"

USER_ID=""
DATE_STR=""
INPUT_CSV="$PROJECT_DIR/data/processed/daily_features.csv"
OUTPUT_CSV=""
PREDICT_MOOD="1"
USE_PERSONAL="1"
GLOBAL_WEIGHT="0.7"

STRESS_LABEL=""
MOOD_LABEL=""
MOOD_TEXT=""
SKIP_FEEDBACK="0"
if [[ -x "$ROOT_DIR/myenv/bin/python" ]]; then
  VENV_PY="$ROOT_DIR/myenv/bin/python"
else
  VENV_PY="$PROJECT_DIR/myenv/bin/python"
fi

usage() {
  cat <<EOF
Usage:
  ./daily_run.sh --user-id <id> --date <YYYY-MM-DD> [options]

Required:
  --user-id <id>
  --date <YYYY-MM-DD>

Prediction options:
  --input <path>              default: wellness_backend/data/processed/daily_features.csv
  --output <path>             default: wellness_backend/data/processed/predictions_personal_<user_id>.csv
  --global-weight <0..1>      default: 0.7
  --no-mood                   disable mood prediction
  --no-personal               disable personal blend, use global only

Feedback options (optional):
  --stress-label <0|1|2>
  --mood-label <0|1|2>
  --mood-text <text>
  --skip-feedback             do not write feedback and do not update personal model

Runtime options:
  --python <path>             default: ../myenv/bin/python (or ./myenv/bin/python)

Examples:
  ./daily_run.sh --user-id u_demo --date 2026-02-28
  ./daily_run.sh --user-id u_demo --date 2026-02-28 --stress-label 2 --mood-label 0 --mood-text "今天很焦虑"
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --user-id) USER_ID="$2"; shift 2 ;;
    --date) DATE_STR="$2"; shift 2 ;;
    --input) INPUT_CSV="$2"; shift 2 ;;
    --output) OUTPUT_CSV="$2"; shift 2 ;;
    --global-weight) GLOBAL_WEIGHT="$2"; shift 2 ;;
    --no-mood) PREDICT_MOOD="0"; shift ;;
    --no-personal) USE_PERSONAL="0"; shift ;;
    --stress-label) STRESS_LABEL="$2"; shift 2 ;;
    --mood-label) MOOD_LABEL="$2"; shift 2 ;;
    --mood-text) MOOD_TEXT="$2"; shift 2 ;;
    --skip-feedback) SKIP_FEEDBACK="1"; shift ;;
    --python) VENV_PY="$2"; shift 2 ;;
    -h|--help) usage; exit 0 ;;
    *) echo "Unknown arg: $1"; usage; exit 1 ;;
  esac
done

if [[ -z "$USER_ID" || -z "$DATE_STR" ]]; then
  echo "Error: --user-id and --date are required"
  usage
  exit 1
fi

if [[ -z "$OUTPUT_CSV" ]]; then
  OUTPUT_CSV="$PROJECT_DIR/data/processed/predictions_personal_${USER_ID}.csv"
fi

if [[ ! -x "$VENV_PY" ]]; then
  echo "Error: python not executable: $VENV_PY"
  exit 1
fi

echo "[1/3] Running prediction..."
PRED_ARGS=("$PROJECT_DIR/src/predict.py" --input "$INPUT_CSV" --user-id "$USER_ID" --output "$OUTPUT_CSV" --global-weight "$GLOBAL_WEIGHT")
if [[ "$PREDICT_MOOD" == "1" ]]; then
  PRED_ARGS+=(--predict-mood)
fi
if [[ "$USE_PERSONAL" == "1" ]]; then
  PRED_ARGS+=(--use-personal)
fi
"$VENV_PY" "${PRED_ARGS[@]}"

if [[ "$SKIP_FEEDBACK" == "1" ]]; then
  echo "[2/3] Feedback skipped (--skip-feedback)."
  echo "[3/3] Personal model update skipped (no new feedback)."
  echo "Done."
  exit 0
fi

if [[ -z "$STRESS_LABEL" && -z "$MOOD_LABEL" && -z "$MOOD_TEXT" ]]; then
  echo "[2/3] No feedback fields provided, skip feedback write."
  echo "[3/3] Personal model update skipped (no new feedback)."
  echo "Done."
  exit 0
fi

echo "[2/3] Writing feedback..."
FB_ARGS=("$PROJECT_DIR/src/collect_feedback.py" --user-id "$USER_ID" --date "$DATE_STR")
if [[ -n "$STRESS_LABEL" ]]; then
  FB_ARGS+=(--stress-label "$STRESS_LABEL")
fi
if [[ -n "$MOOD_LABEL" ]]; then
  FB_ARGS+=(--mood-label "$MOOD_LABEL")
fi
if [[ -n "$MOOD_TEXT" ]]; then
  FB_ARGS+=(--mood-text "$MOOD_TEXT")
fi
"$VENV_PY" "${FB_ARGS[@]}"

echo "[3/3] Updating personal model..."
"$VENV_PY" "$PROJECT_DIR/src/update_personal_model.py" --user-id "$USER_ID"

echo "Done."
