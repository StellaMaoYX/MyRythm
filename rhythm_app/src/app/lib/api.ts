const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.toString().trim();
const runtimeHost =
  typeof window !== "undefined" && window.location.hostname ? window.location.hostname : "127.0.0.1";

export const API_BASE_URL = configuredBaseUrl || `http://${runtimeHost}:8000`;

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${res.status} ${res.statusText}: ${text}`);
  }
  return (await res.json()) as T;
}

export type CheckinResponse = {
  user_id: string;
  date: string;
  emotion_summary: {
    raw_text: string;
    sentiment_score: number;
    valence: "positive" | "neutral" | "negative";
    emotion_tags: string[];
  };
  life_events_summary: {
    raw_text: string;
    events: Array<{ text: string; impact_score: number }>;
    high_impact_count: number;
  };
};

export type DailyPrediction = {
  user_id: string;
  date: string;
  prediction: {
    stress_pred_code: number;
    stress_pred_label: string;
    p_relax: number;
    p_normal: number;
    p_stress: number;
    stress_model_source: string;
    mood_pred_code?: number;
    mood_pred_label?: string;
    p_mood_bad?: number;
    p_mood_mid?: number;
    p_mood_good?: number;
    mood_model_source?: string;
  };
};

export type CoachResponse = {
  explanation: string;
  anticipation: string;
  prepare_suggestion: string[];
  assistant_reply: string;
};

export function postCheckin(body: {
  user_id: string;
  date: string;
  mood_text: string;
  life_event_text: string;
  life_events: string[];
}): Promise<CheckinResponse> {
  return request<CheckinResponse>("/checkin", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function postPredictDaily(body: {
  user_id: string;
  date: string;
  use_personal: boolean;
  predict_mood: boolean;
  global_weight: number;
  checkin: CheckinResponse;
  iwatch_features: Record<string, number>;
}): Promise<DailyPrediction> {
  return request<DailyPrediction>("/predict/daily", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function postCoachChat(body: {
  user_id: string;
  date: string;
  checkin: CheckinResponse;
  prediction: DailyPrediction["prediction"];
  calendar_events: string[];
  message: string;
  chat_history: Array<{ role: string; content: string }>;
}): Promise<CoachResponse> {
  return request<CoachResponse>("/coach/chat", {
    method: "POST",
    body: JSON.stringify(body),
  });
}
