# Kisan Sahayak (ಕಿಸಾನ್ ಸಹಾಯಕ) 🌾
AI-First Agricultural Assistant for Low-Literacy Users in Karnataka.

## 🚀 Overview
Kisan Sahayak is a voice-first mobile app designed for farmers. It simplifies finding government schemes using:
- **Voice Interface:** Ask questions in Kannada/English.
- **AI Processing:** Ollama (Qwen2.5) backend for intelligent query handling.
- **Zero-Typing UX:** Big icons and voice-driven navigation.
- **Multilingual Support:** Full Kannada and English localization.

---

## 🛠️ Tech Stack
- **Frontend:** React Native (Expo/CLI), TypeScript, Haptics, TTS.
- **Backend:** FastAPI (Python), Ollama (Local LLM), Whisper (Speech-to-Text).
- **AI Models:** 
  - `qwen2.5` (via Ollama) for reasoning.
  - `openai-whisper` for transcription.

---

## 🏃 Setup Instructions

### 1. Prerequisites
- **Python 3.10+**
- **Node.js 18+**
- **Ollama** installed (from ollama.com)
- **ffmpeg** installed (required for Whisper)

### 2. Backend Setup
1. Open a terminal in `./backend`.
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Pull the Ollama model:
   ```bash
   ollama pull qwen2.5
   ```
4. Start the server:
   - **Windows:** `./run.ps1`
   - **Linux/Mac:** `bash run.sh`
   The backend runs at `http://localhost:8000`.

### 3. Frontend Setup
1. Open a terminal in `./KisanSahayak`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run on Android/iOS Emulator:
   ```bash
   npm run android
   # or
   npm run ios
   ```
   *Note: If using an Android Emulator, it connects to the host via `10.0.2.2`. This is pre-configured.*

---

## 📁 Project Structure
- `/backend`: FastAPI server, Ollama logic, Whisper integration.
- `/KisanSahayak`: React Native application code.
  - `/src/components`: Big icons, Voice Recorder, etc.
  - `/src/screens`: Specialized flows for low-literacy users.
  - `/src/constants`: Bilingual translations and scheme data.

---

## ⚖️ Features
- **Smart Eligibility:** Answer 3 simple icons (Farmer? Aadhaar? Woman?) to get filtered schemes.
- **Voice Chat:** "ಸೌರ ಪಂಪ್ ಯೋಜನೆ ಬಗ್ಗೆ ತಿಳಿಸಿ" (Tell me about solar pump scheme) — AI answers and speaks.
- **Audio Guides:** Every scheme description can be read aloud in Kannada.
- **Offline Fallback:** If the AI server is down, the app uses built-in logic to show schemes.
