#!/bin/bash
# Dubai E-Commerce — Yerel Başlatma Scripti
# Çalıştır: chmod +x start_local.sh && ./start_local.sh

set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$SCRIPT_DIR/backend"
FRONTEND_DIR="$SCRIPT_DIR/frontend"

echo "=== Dubai E-Commerce Platformu ==="
echo ""

# --- Backend ---
echo "[1/4] Python bağımlılıkları kontrol ediliyor..."
cd "$BACKEND_DIR"
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi
source venv/bin/activate
pip install -r requirements.txt -q

echo "[2/4] Playwright Chromium kuruluyor (ilk çalıştırmada biraz sürer)..."
python -m playwright install chromium

echo "[3/4] Backend başlatılıyor (port 8000)..."
mkdir -p uploads/documents uploads/screenshots/noon uploads/screenshots/amazon uploads/status
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload &
BACKEND_PID=$!
echo "    Backend PID: $BACKEND_PID"
sleep 3

# --- Frontend ---
echo "[4/4] Frontend başlatılıyor (port 5174)..."
cd "$FRONTEND_DIR"
npm install -q
npm run dev &
FRONTEND_PID=$!
echo "    Frontend PID: $FRONTEND_PID"
sleep 3

echo ""
echo "✓ Platform hazır!"
echo "  → Tarayıcınızda açın: http://localhost:5174"
echo "  → Backend API:         http://localhost:8000"
echo ""
echo "Durdurmak için Ctrl+C basın."
echo ""

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo 'Durduruldu.'" EXIT
wait
