# Frontend-Backend Integration

## 1) Start backend

```bash
cd ../wellness_backend
source ../myenv/bin/activate
export OPENAI_API_KEY="your_key_here"
uvicorn api_server:app --app-dir src --host 0.0.0.0 --port 8000 --reload
```

## 2) Configure frontend API url

```bash
cd "../rhythm_app"
cp .env.example .env
# edit .env if backend host/port differs
```

## 3) Install and start frontend

```bash
npm install
npm run dev
```

## Connected flows

- `CheckInPage`
  - Calls `POST /checkin`
  - Calls `POST /predict/daily`
  - Stores latest checkin/prediction in localStorage (`rhythm_session_state`)

- `InsightChatPage`
  - Reads latest `rhythm_session_state`
  - Calls `POST /coach/chat`
  - Falls back to local mock content if backend call fails

## Notes

- Current demo user id is hardcoded as `u_demo` in `CheckInPage`.
- Backend CORS is enabled for hackathon dev mode.
