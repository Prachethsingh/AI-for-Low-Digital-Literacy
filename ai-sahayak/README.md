# AI Sahayak (Hackathon Prototype)

Voice-first, low-literacy UI prototype for **PM Kisan Samman Nidhi** and **Kisan Fasal Bima Yojana** with:

- Language first: English + Kannada
- Big tap targets, minimal reading
- TTS "Listen" button on every step
- Voice input via browser Speech Recognition (when supported)
- Camera scan via browser `getUserMedia` (when supported)

## Run

```bash
cd ai-sahayak
npm install
npm run dev
```

Open the printed URL (usually `http://localhost:5173`).

## Notes

- Voice input and camera depend on the browser and permissions.
- "Download PDF" is a demo download (`application.txt`). Swap with real PDF generation if needed.

