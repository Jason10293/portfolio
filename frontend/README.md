<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1aQrFCGDXK4uIKDKjPhGIbMIdBHIiJPvY

## Run Locally

**Prerequisites:** Node.js, Spotify API credentials (`SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `SPOTIFY_REFRESH_TOKEN`)

Copy `.env.example` to `.env` in the repository root and fill in the values,
or export the variables in your shell as shown below.

### 1. Start the Spotify bridge (backend)
```bash
cd backend
npm install
export SPOTIFY_CLIENT_ID=...
export SPOTIFY_CLIENT_SECRET=...
export SPOTIFY_REFRESH_TOKEN=...
node server.js
```
The server exposes `GET /now-playing` (live track), `GET /top-artists`
(monthly stats), and `GET /listening-history` (recent tracks). Vite proxies the
frontend's `/api/*` requests to these local routes.

### 2. Start the frontend
```bash
cd frontend
npm install
npm run dev
```
Vite serves the UI at `http://localhost:5173` and proxies `/api/*` requests to
the backend.

For Vercel deployments, add the same three Spotify variables to the project's
Production environment and redeploy. The refresh token must have
`user-read-currently-playing`, `user-read-recently-played`, and `user-top-read`
scopes.
