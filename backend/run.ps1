Write-Host "🌾 Starting Kisan Sahayak Backend..." -ForegroundColor Green

# 1. Install Python dependencies
Write-Host "📦 Installing Python dependencies..."
pip install -r requirements.txt -q

# 2. Check if Ollama is running
Write-Host ""
Write-Host "🤖 Checking Ollama..."
try {
    $response = Invoke-RestMethod -Uri "http://localhost:11434/api/tags" -Method Get -ErrorAction Stop
    Write-Host "   ✅ Ollama is running."
} catch {
    Write-Host "   ⚠️  Ollama is not running. Start it with: ollama serve" -ForegroundColor Yellow
    Write-Host "      Then pull the model: ollama pull qwen2.5" -ForegroundColor Yellow
    Write-Host "   (The app will use rule-based fallback without Ollama)" -ForegroundColor Yellow
}

# 3. Whisper check
Write-Host ""
if (Get-Command whisper -ErrorAction SilentlyContinue) {
    Write-Host "🎤 Whisper is installed."
} else {
    Write-Host "⚠️  Whisper not found. Voice recording will show a warning." -ForegroundColor Yellow
    Write-Host "   Install with: pip install openai-whisper" -ForegroundColor Yellow
}

# 4. Start server
Write-Host ""
Write-Host "🚀 Starting server on http://0.0.0.0:8000"
Write-Host "   Health check: http://localhost:8000/health"
Write-Host "   API docs:     http://localhost:8000/docs"
Write-Host ""

uvicorn main:app --host 0.0.0.0 --port 8000 --reload
