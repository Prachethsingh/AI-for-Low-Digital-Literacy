# 🌿 Kisan Mitra — ಕಿಸಾನ್ ಮಿತ್ರ

> Voice-first, AI-powered government scheme assistant for low-literacy farmers in Karnataka.
> Built with **Vite + React + TypeScript**. Zero backend required to run.

---

## 🚀 Quick Start (30 seconds)

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open in browser
# http://localhost:5173
```

> Works 100% offline — no backend, no API keys needed. AI voice answers work through the browser's built-in Web Speech API.

---

## ✨ Unique Features

| Feature | What it does |
|---|---|
| 🧭 Auto-eligibility engine | Asks 3 Yes/No questions → filters which of 11 schemes you qualify for |
| 🎤 Voice-first AI assistant | Speak any question in Kannada or English → get an audio answer |
| 📷 Camera document scanner | Capture Aadhaar, land docs, crop damage photos inside the flow |
| 🌿 "Mitti" earth aesthetic | Terracotta, soil-brown, parchment palette — feels local, not foreign |
| 👨‍🌾 Animated mascot | Farmer mascot with speech bubble greets and guides users |
| 🔊 Full TTS in Kannada | Every question and answer is read aloud using kn-IN voice |
| 📶 Zero-dependency AI | Works offline with local rule engine; optionally connects to Ollama |
| 🇮🇳 11 real schemes | PM-KISAN, PMFBY, KCC, PMKSY, PM-KMY, e-NAM, PM-KUSUM, Soil Health, PMJDY, PMAY, PMMVY |

---

## 📱 Screens

```
Language picker → Home → Profile (3 Yes/No) → Eligible schemes list
                          ↓
                  Scheme detail → Guided Q&A flow → Summary → Done (apply/download/call)

Home → All Schemes (browse + filter by category)
Home → Voice AI (speak any question, get voice answer)
```

---

## 🤖 Connecting Ollama (Optional — for smarter AI answers)

1. Install Ollama: https://ollama.ai
2. Pull a model:
   ```bash
   ollama pull qwen2.5
   # or for better Kannada:
   ollama pull llama3.2
   ```
3. Start Ollama:
   ```bash
   ollama serve
   ```
4. The app automatically uses Ollama at `http://localhost:11434`.
   If Ollama is unavailable, it falls back to the built-in rule engine.

---

## 🎤 Voice (Web Speech API)

- **Text-to-Speech (TTS)**: Works in Chrome, Edge, Safari. Kannada voice = `kn-IN`.
- **Speech Recognition (STT)**: Works in Chrome + Edge only (uses webkitSpeechRecognition).
- If mic doesn't appear, use the example chips or type queries instead.

---

## 📦 Build for Production

```bash
npm run build
# Output in dist/ — serve as a static site (Netlify, Vercel, GitHub Pages, etc.)
```

---

## 🗂 Project Structure

```
src/
  domain/
    schemes.ts          ← All 11 schemes + eligibility engine
  ui/
    App.tsx             ← Main router
    styles.css          ← "Mitti" earth aesthetic (full custom CSS)
    speech/
      useSpeech.ts      ← TTS + STT hook
    screens/
      LanguageScreen    ← Kannada / English picker
      HomeScreen        ← 4-card landing with mascot
      ProfileScreen     ← 3-step Yes/No eligibility quiz
      SchemeListScreen  ← Filtered eligible schemes (skeleton loading)
      AllSchemesScreen  ← Browse all 11 schemes with category filter
      SchemeDetailScreen← Full scheme info + TTS + apply buttons
      FlowScreen        ← Guided Q&A (Yes/No + choice + camera)
      SummaryScreen     ← Review answers before submitting
      DoneScreen        ← Success + apply links + download + helpline
      VoiceScreen       ← AI chat assistant (Ollama + local fallback)
```

---

## 🌾 Government Schemes Covered

| # | Scheme | For | Benefit |
|---|---|---|---|
| 1 | PM-KISAN | Farmers | ₹6,000/year |
| 2 | PMFBY | Farmers | Crop insurance |
| 3 | KCC | Farmers | Low-interest loans |
| 4 | PMKSY | Farmers | Irrigation subsidy |
| 5 | PM-KMY | Farmers | ₹3,000/month pension |
| 6 | e-NAM | Farmers | Online market access |
| 7 | PM-KUSUM | Farmers | Solar pump |
| 8 | Soil Health Card | Farmers | Free soil test |
| 9 | PM Jan Dhan | Everyone | Free bank account |
| 10 | PM Awas | Everyone | Housing subsidy |
| 11 | PMMVY | Women | ₹5,000 maternity |

---

## 🛠 Tech Stack

- **Vite** — lightning fast dev + build
- **React 18** + **TypeScript**
- **Web Speech API** — TTS + STT (no SDK needed)
- **Ollama** (optional) — local LLM for smarter answers
- **Pure CSS** — no UI framework, fully custom "Mitti" design system

---

## 📞 Real Helplines

| Scheme | Helpline |
|---|---|
| PM-KISAN | 155261 |
| PMFBY / Crop Insurance | 14447 |
| PM Jan Dhan | 1800-11-0001 |
| PM Awas | 1800-11-3377 |
| General Kisan | 1800-180-1551 |

---

*Made with ❤️ for Karnataka farmers. All scheme data from official Government of India sources.*
