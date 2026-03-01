import type { CheckinResponse, DailyPrediction } from "./api";

const KEY = "rhythm_session_state";

export type SessionState = {
  userId: string;
  date: string;
  checkin?: CheckinResponse;
  prediction?: DailyPrediction["prediction"];
};

export function saveSessionState(state: SessionState): void {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function loadSessionState(): SessionState | null {
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SessionState;
  } catch {
    return null;
  }
}
