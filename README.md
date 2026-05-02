# Kisan Mitra (AI Sahayak) 🌾

Kisan Mitra is an end-to-end, voice-first, AI-driven agriculture scheme assistant designed for low-literacy farmers in India. Built specifically for hackathons and rapid deployment, it provides an intuitive, highly accessible interface where users can discover, query, and apply for government schemes using their voice in local languages.

## 🌟 Key Features

*   **🗣️ Voice-First Interaction (Zero Literacy UI)**
    *   No typing required. Users tap a single microphone button to speak.
    *   Browser-native Text-to-Speech (TTS) automatically reads out all questions, schemes, and AI answers.
    *   Big tap targets and skeuomorphic UI components optimized for rural mobile usage.
*   **🤖 Ultra-Fast Open-Source AI Integration**
    *   Powered by the **Groq API** running `llama-3.3-70b-versatile` natively.
    *   Capable of understanding mixed-language queries, parsing intent, and providing accurate government scheme information in 2-3 simple sentences.
    *   Built-in local fallback engine ensuring offline grace-degradation if network fails.
*   **🌍 Bilingual Support**
    *   Fully localized in **Kannada** and **English**, ensuring the app feels native to local demographics.
    *   Prompts injected into the AI strictly enforce language alignment.
*   **📈 Real-Time Live Dashboard**
    *   A hidden analytics layer that tracks user profiling, scheme discovery, and application completions.
    *   **Live Dashboard** screen updates instantly without refreshing via localized polling architecture (designed to mock realtime databases like Supabase locally).
*   **📄 Dynamic Scheme Engine**
    *   Interactive multi-step application flows for major schemes (PM-KISAN, PMFBY, PM-KUSUM, KCC, PMMVY, etc.).
    *   Captures user profiling (Farmer status, Aadhaar possession, Gender) to automatically suggest eligible schemes.

## 🏗️ Architecture & Tech Stack

*   **Frontend**: React 18 + Vite + TypeScript.
*   **Styling**: Pure CSS tailored for a "glassmorphic" and accessible aesthetic (`index.css`).
*   **AI Engine**: Groq SDK for instant sub-second inference.
*   **Voice Engine**: Web Speech API (`webkitSpeechRecognition` & `speechSynthesis`).
*   **Analytics/Database**: LocalStorage implementation mimicking a real-time database (drop-in replacement for Supabase).

## 🚀 Getting Started

The active codebase is located in the `kisan-mitra/kisan-mitra` directory.

### 1. Setup

```bash
cd kisan-mitra/kisan-mitra
npm install
```

### 2. Configuration

The Groq API key is already hardcoded inside `src/lib/groq.ts` for immediate hackathon demonstration (`gsk_...`). 
*If you need to change it, simply update the `apiKey` property in that file.*

### 3. Run Development Server

```bash
npm run dev
```

Open `http://localhost:5173` in your browser. (Note: Chrome or Edge is highly recommended for full Web Speech API support).

## 🗂️ Project Structure

*   **`src/domain/schemes.ts`**: The core data layer containing all hardcoded government schemes, icons, details, and eligibility logic.
*   **`src/ui/screens/`**: Contains the various UI views:
    *   `VoiceScreen.tsx`: The chat interface communicating with Groq.
    *   `ProfileScreen.tsx`: The profiling wizard.
    *   `SchemeDetailScreen.tsx`: Detailed views of schemes.
    *   `LiveDashboard.tsx`: The real-time mock-analytics dashboard.
*   **`src/lib/`**: Contains external integrations:
    *   `groq.ts`: The Groq SDK singleton and AI prompt logic.
    *   `supabase.ts`: The LocalStorage analytics tracker (originally Supabase).
*   **`src/ui/speech/useSpeech.ts`**: The custom hook managing browser voice APIs.

## 💡 Important Notes for Demo

1.  **Voice Input**: Microphone permissions must be granted. If you are serving the app on a mobile device, ensure you are using `HTTPS` or `localhost`, otherwise the browser will block the microphone API.
2.  **Live Analytics**: Click the "Live" tab (📈) on the bottom navigation bar to view user interactions flowing in real-time. This is highly effective to show judges the backend tracking capabilities.
3.  **Receipt Generation**: Upon completing an application flow, the app generates a downloadable `.txt` receipt to simulate an official confirmation document.
