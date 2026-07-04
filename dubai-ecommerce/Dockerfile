# Dubai E-Ticaret Platformu — VPS deployment image
# Frontend (React build) + Backend (FastAPI) + Google Chrome + xvfb tek container'da.

# ── Stage 1: Frontend build ────────────────────────────────────────────────────
FROM node:20-slim AS frontend-build
WORKDIR /app
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# ── Stage 2: Backend + browser ─────────────────────────────────────────────────
FROM mcr.microsoft.com/playwright/python:v1.49.0-noble
WORKDIR /app/backend

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Google Chrome (gerçek Chrome — noon.com bot tespitini aşmak için) + xvfb sanal ekran
RUN apt-get update && apt-get install -y --no-install-recommends wget gnupg xvfb \
    && wget -qO- https://dl.google.com/linux/linux_signing_key.pub \
       | gpg --dearmor > /usr/share/keyrings/google-chrome.gpg \
    && echo "deb [arch=amd64 signed-by=/usr/share/keyrings/google-chrome.gpg] http://dl.google.com/linux/chrome/deb/ stable main" \
       > /etc/apt/sources.list.d/google-chrome.list \
    && apt-get update && apt-get install -y --no-install-recommends google-chrome-stable \
    && rm -rf /var/lib/apt/lists/*

COPY backend/ .
COPY --from=frontend-build /app/dist ./static

EXPOSE 8000

# xvfb-run: Chrome görünür modda çalışır (headless bot tespiti yok) ama sanal ekranda
CMD ["xvfb-run", "-a", "--server-args=-screen 0 1280x900x24", \
     "python", "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
