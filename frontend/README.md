<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1aQrFCGDXK4uIKDKjPhGIbMIdBHIiJPvY

## Run Locally

**Prerequisites:** Node.js, Spotify API credentials (`SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `SPOTIFY_REFRESH_TOKEN`)

### 1. Start the Spotify bridge (backend)
```bash
cd backend
npm install
export SPOTIFY_CLIENT_ID=...
export SPOTIFY_CLIENT_SECRET=...
export SPOTIFY_REFRESH_TOKEN=...
node server.js
```
The server exposes `GET /now-playing` (live track) and `GET /top-artists` (monthly stats).

### 2. Start the frontend
```bash
cd frontend
npm install
npm run dev
```
Vite serves the UI at `http://localhost:5173` and proxies `/now-playing` requests to the backend.
