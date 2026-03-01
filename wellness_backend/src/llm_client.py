import json
import os
from typing import Any

from anthropic import Anthropic


LLM_PROVIDER = os.getenv("LLM_PROVIDER", "anthropic").lower()
DEFAULT_ANTHROPIC_MODEL = os.getenv("LLM_MODEL", "claude-haiku-4-5-20251001")


ANTHROPIC_API_KEY_HARDCODED = ""
OPENAI_API_KEY_HARDCODED = ""


def _safe_json_loads(text: str) -> dict[str, Any]:
    cleaned = text.strip()
    if cleaned.startswith("```"):
        cleaned = cleaned.strip("`")
        if cleaned.startswith("json"):
            cleaned = cleaned[4:].strip()
    try:
        data = json.loads(cleaned)
    except Exception as exc:
        raise RuntimeError(f"LLM output is not valid JSON: {exc}; raw={text[:300]}") from exc
    if not isinstance(data, dict):
        raise RuntimeError("LLM output JSON must be an object")
    return data


def _anthropic_client() -> Anthropic:
    api_key = ANTHROPIC_API_KEY_HARDCODED.strip() or os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        raise RuntimeError("ANTHROPIC_API_KEY is not set (env or hardcoded)")
    return Anthropic(api_key=api_key)


def _anthropic_complete(system_prompt: str, user_prompt: str, temperature: float) -> str:
    client = _anthropic_client()
    resp = client.messages.create(
        model=DEFAULT_ANTHROPIC_MODEL,
        max_tokens=1200,
        temperature=temperature,
        system=system_prompt,
        messages=[{"role": "user", "content": user_prompt}],
    )
    text_parts = [blk.text for blk in resp.content if getattr(blk, "type", "") == "text"]
    if not text_parts:
        raise RuntimeError("Anthropic response has no text content")
    return "\n".join(text_parts)


def _openai_complete(system_prompt: str, user_prompt: str, temperature: float) -> str:
    try:
        from openai import OpenAI
    except Exception as exc:
        raise RuntimeError("OpenAI SDK not installed. Install openai package or use LLM_PROVIDER=anthropic") from exc

    api_key = OPENAI_API_KEY_HARDCODED.strip() or os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise RuntimeError("OPENAI_API_KEY is not set (env or hardcoded)")

    model = os.getenv("LLM_MODEL", "gpt-4.1-mini")
    client = OpenAI(api_key=api_key)
    resp = client.chat.completions.create(
        model=model,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        temperature=temperature,
        response_format={"type": "json_object"},
    )
    return resp.choices[0].message.content or "{}"


def _complete(system_prompt: str, user_prompt: str, temperature: float) -> str:
    if LLM_PROVIDER == "anthropic":
        return _anthropic_complete(system_prompt, user_prompt, temperature)
    if LLM_PROVIDER == "openai":
        return _openai_complete(system_prompt, user_prompt, temperature)
    raise RuntimeError(f"Unsupported LLM_PROVIDER: {LLM_PROVIDER}")


def llm_checkin_extract(payload: dict[str, Any]) -> dict[str, Any]:
    system_prompt = """You are a clinical-style emotional signal extractor.

A user has written a short check-in describing how they feel today in their own words.

Your role:
Quietly translate their language into structured emotional signals.
Do not interpret, advise, reframe, or respond conversationally.
Do not add meaning that isn’t present.
Do not soften or amplify beyond what is reasonable.

Be slightly generous with positive sentiment:
If a user says “okay,” “fine,” “not bad,” or similar, treat it as mildly positive rather than neutral.
People often understate how they feel.

Output ONLY valid JSON with the following fields:

{
“primary_emotion”: string,
“secondary_emotion”: string | null,
“valence”: number,
“energy_level”: number,
“stress_level”: number,
“confidence”: number
}

Rules:
• Use plain emotion words (e.g., calm, anxious, motivated, drained, content, irritable).
• Do not use diagnostic labels.
• If the user expresses mixed feelings, reflect that in primary and secondary emotion.
• If emotional signal is unclear, choose the most plausible mild interpretation and lower confidence.
• Do not output explanations.
• Do not output commentary.
• Do not include markdown.
• Return JSON only."""
    user_prompt = (
        "Extract emotional signal fields from this check-in input.\n\n"
        f"Input JSON:\n{json.dumps(payload, ensure_ascii=False)}"
    )

    content = _complete(system_prompt, user_prompt, temperature=0.2)
    return _safe_json_loads(content)


def llm_coach_generate(payload: dict[str, Any]) -> dict[str, Any]:
    system_prompt = """You are Rhythm — a perceptive, emotionally intelligent friend who understands patterns in data. 
You are NOT a doctor, therapist, coach, or authority figure.

You are given:
- The user’s recent biometric signals (compared to their baseline)
- Their self-reported mood today
- Their daily schedule
- Their current cycle phase (if available)

Your job:
Translate their data into something genuinely useful.
Be specific to their signals.
Be warm, grounded, and human.
Be brief.

Output exactly 4 JSON fields:
- explanation
- anticipation
- prepare_suggestion (array of exactly 3 items)
- assistant_reply

Field definitions:

explanation:
Explain what pattern is happening in their body, referencing specific signals (e.g., HRV down 12%, sleep 1.3h shorter than baseline).
Lead with what’s stable or strong before mentioning strain.
Maximum 2 sentences.

anticipation:
Predict what they might notice later today socially, emotionally, or cognitively — based only on their signals + schedule.
Be gentle and observational, not dramatic.
Maximum 2 sentences.

prepare_suggestion:
Exactly 3 short, specific, context-aware actions.
Each suggestion must:
- Directly connect to their signals or schedule
- Be concrete and situational (e.g., “Move your 3pm brainstorm to a solo task block”)
- Avoid generic wellness advice
Each item maximum 1 sentence.

assistant_reply:
A short, warm message that makes them feel understood.
If cycle phase explains something, acknowledge it naturally.
No managing tone. No fixing tone.
Maximum 2 sentences.
Directly answer the user's latest message/question when one is provided in input JSON as `message`.
Do not ignore the user's explicit question.
When the user asks a direct question, prioritize the direct answer in `assistant_reply`.
In that case, `explanation`, `anticipation`, and `prepare_suggestion` can be brief and minimal.

Hard constraints:
- Never use these words: warning, alert, risk, crash, abnormal, concerning, dangerous
- No generic wellness advice (no “drink water”, “practice mindfulness”, “get rest” unless tied to specific signal + event)
- Do not moralize.
- Do not over-medicalize.
- Do not sound like a productivity coach.
- Do not mention “baseline deviation” mechanically — phrase it naturally.
- Keep tone like a thoughtful friend who happens to see patterns.

Return ONLY valid JSON.
No markdown.
No extra commentary."""
    user_prompt = (
        "Generate a response object with this exact shape:\n"
        "{\n"
        '  "explanation": "string",\n'
        '  "anticipation": "string",\n'
        '  "prepare_suggestion": ["string", "string", "string"],\n'
        '  "assistant_reply": "string"\n'
        "}\n\n"
        "If input JSON contains a non-empty `message`, `assistant_reply` must directly answer that message first.\n"
        "Keep suggestions practical and specific to today's schedule and stress/mood signals.\n\n"
        f"Input JSON:\n{json.dumps(payload, ensure_ascii=False)}"
    )

    content = _complete(system_prompt, user_prompt, temperature=0.4)
    return _safe_json_loads(content)
