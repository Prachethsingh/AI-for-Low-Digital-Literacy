#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# Kisan Sahayak – Backend Startup Script
# ─────────────────────────────────────────────────────────────────────────────

echo "🌾 Starting Kisan Sahayak Backend..."
echo ""

# 1. Install Python dependencies
echo "📦 Installing Python dependencies..."
pip install -r requirements.txt -q

# 2. Check if Ollama is running
echo ""
echo "🤖 Checking Ollama..."
if curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
    echo "   ✅ Ollama is running."
else
    echo "   ⚠️  Ollama is not running. Start it with: ollama serve"
    echo "      Then pull the model: ollama pull qwen2.5"
    echo "   (The app will use rule-based fallback without Ollama)"
fi

# 3. Whisper check
echo ""
if command -v whisper > /dev/null 2>&1; then
    echo "🎤 Whisper is installed."
else
    echo "⚠️  Whisper not found. Voice recording will show a warning."
    echo "   Install with: pip install openai-whisper"
fi

# 4. Start server
echo ""
echo "🚀 Starting server on http://0.0.0.0:8000"
echo "   Health check: http://localhost:8000/health"
echo "   API docs:     http://localhost:8000/docs"
echo ""

uvicorn main:app --host 0.0.0.0 --port 8000 --reload
