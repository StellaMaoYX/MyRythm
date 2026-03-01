# Deploy and Share a Public "Try it out" Link

This setup deploys:
- Backend (`wellness_backend`) on **Render**
- Frontend (`rhythm_app`) on **Vercel**

Then your "Try it out" link is the Vercel frontend URL.

## 1) Push this repo to GitHub

From project root:

```bash
git add .
git commit -m "Add deploy config for Vercel + Render"
git push
```

## 2) Deploy backend on Render

1. Go to Render -> New -> **Blueprint**
2. Connect your GitHub repo
3. Render will detect `wellness_backend/render.yaml`
4. Set environment variable in Render service:

- `ANTHROPIC_API_KEY` = your real Claude key

5. Deploy and wait for green status
6. Copy backend URL, e.g.:

```text
https://rhythm-backend.onrender.com
```

7. Verify in browser:

```text
https://rhythm-backend.onrender.com/health
```

You should see JSON response.

## 3) Deploy frontend on Vercel

1. Go to Vercel -> New Project
2. Import same GitHub repo
3. Set **Root Directory** to:

```text
rhythm_app
```

4. In Vercel Project Settings -> Environment Variables, add:

- `VITE_API_BASE_URL` = your Render backend URL
  - example: `https://rhythm-backend.onrender.com`

5. Deploy
6. Open Vercel URL, e.g.:

```text
https://rhythm-app-xxxxx.vercel.app
```

That URL is your public **Try it out** link.

## 4) CORS note

Current backend CORS is `allow_origins=["*"]` in `wellness_backend/src/api_server.py`.
This is fine for hackathon demos.

## 5) Common failure checks

- Frontend shows `Backend sync failed`:
  - Check `VITE_API_BASE_URL` in Vercel is correct
  - Check Render service is awake (free tier may sleep)
- 502 from backend:
  - Check `ANTHROPIC_API_KEY` is set in Render
  - Check model id in `wellness_backend/src/llm_client.py` is valid for your Anthropic account

