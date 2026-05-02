"""
Kisan Sahayak – Backend Server
--------------------------------
FastAPI server that connects:
  1. Whisper (speech-to-text)
  2. Ollama + Qwen3 (scheme eligibility reasoning)
  3. Pre-built scheme metadata for fast responses

Run with:  uvicorn main:app --host 0.0.0.0 --port 8000 --reload
"""

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
import json
import tempfile
import os
import subprocess
from schemes import SCHEMES, SCHEME_AUDIO_SCRIPTS

app = FastAPI(title="Kisan Sahayak API", version="1.0.0")

# ── CORS (allow React Native / Expo requests) ──────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

OLLAMA_URL = "http://localhost:11434/api/generate"
OLLAMA_MODEL = "qwen3.5:latest"   # fallback to qwen2.5 if qwen3.5 unavailable


# ══════════════════════════════════════════════════════════════════════════════
# MODELS
# ══════════════════════════════════════════════════════════════════════════════

class EligibilityRequest(BaseModel):
    profile: dict
    lang: str = "en"

class TextQueryRequest(BaseModel):
    query: str
    lang: str = "en"


# ══════════════════════════════════════════════════════════════════════════════
# HELPERS
# ══════════════════════════════════════════════════════════════════════════════

def build_eligibility_prompt(req: EligibilityRequest) -> str:
    lang_instruction = (
        "Respond with scheme explanations in Kannada language."
        if req.lang == "kn"
        else "Respond with scheme explanations in English."
    )

    profile = req.profile

    scheme_list = json.dumps(
        [{"id": s["id"], "name": s["name_en"], "requires_farmer": s["requires_farmer"],
          "requires_aadhaar": s["requires_aadhaar"], "for_women": s.get("for_women", False)}
         for s in SCHEMES],
        ensure_ascii=False
    )

    return f"""You are a government scheme eligibility assistant for Indian farmers.

User profile: {json.dumps(profile)}

Available schemes:
{scheme_list}

{lang_instruction}

Return ONLY a valid JSON array of eligible scheme IDs (strings) based on the profile.
Example: ["pmkisan", "pmfby", "kcc"]
No explanation, no markdown, just the JSON array.
"""


async def call_ollama(prompt: str) -> str:
    """Call Ollama and return the response text."""
    payload = {
        "model": OLLAMA_MODEL,
        "prompt": prompt,
        "stream": False,
        "options": {"temperature": 0.1, "num_predict": 256},
    }
    async with httpx.AsyncClient(timeout=30.0) as client:
        resp = await client.post(OLLAMA_URL, json=payload)
        resp.raise_for_status()
        data = resp.json()
        return data.get("response", "").strip()


def filter_schemes_locally(req: EligibilityRequest) -> list[str]:
    profile = req.profile
    eligible = []
    
    # Map different possible keys for the same concepts
    is_farmer = profile.get("is_farmer", False) or profile.get("farmer_type") in ["small", "marginal"] or profile.get("q1") == "yes"
    has_aadhaar = profile.get("has_aadhaar", False) or profile.get("q2") == "yes" or profile.get("q2_cam") is not None
    is_woman = profile.get("is_woman", False)

    for s in SCHEMES:
        # Rule-based filtering
        if s["requires_farmer"] and not is_farmer:
            continue
        if s["requires_aadhaar"] and not has_aadhaar:
            continue
        if s.get("for_women", False) and not is_woman:
            continue
        
        # Specific logic for PM Kisan (needs land registered and small/medium land)
        if s["id"] == "pmkisan":
            if profile.get("q3") == "no": # land not registered
                continue
        
        eligible.append(s["id"])
    return eligible


# ══════════════════════════════════════════════════════════════════════════════
# ROUTES
# ══════════════════════════════════════════════════════════════════════════════

@app.get("/health")
async def health():
    return {"status": "ok", "service": "kisan-sahayak-backend"}


@app.post("/eligibility")
async def get_eligible_schemes(req: EligibilityRequest):
    """
    Returns list of schemes the user is eligible for.
    Tries Ollama first; falls back to rule-based logic.
    """
    ollama_ids: list[str] = []

    try:
        prompt = build_eligibility_prompt(req)
        raw = await call_ollama(prompt)

        # Strip markdown fences if present
        raw = raw.replace("```json", "").replace("```", "").strip()
        ollama_ids = json.loads(raw)
        if not isinstance(ollama_ids, list):
            raise ValueError("Not a list")
    except Exception as e:
        print(f"[WARN] Ollama call failed ({e}), using rule-based fallback.")
        ollama_ids = filter_schemes_locally(req)

    # Build rich scheme objects for the app
    id_set = set(ollama_ids)
    result = [s for s in SCHEMES if s["id"] in id_set]

    return {
        "eligible_schemes": result,
        "lang": req.lang,
        "source": "ollama" if ollama_ids else "local",
    }


@app.post("/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
    """
    Accepts an audio file (webm/m4a/wav/mp3) and returns transcribed text via Whisper.
    Requires `whisper` CLI installed: pip install openai-whisper
    """
    suffix = os.path.splitext(file.filename or "audio.m4a")[1] or ".m4a"
    with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as tmp:
        tmp.write(await file.read())
        tmp_path = tmp.name

    try:
        result = subprocess.run(
            ["whisper", tmp_path, "--model", "base", "--output_format", "json",
             "--output_dir", "/tmp", "--language", "kn"],
            capture_output=True, text=True, timeout=60
        )
        json_path = tmp_path.replace(suffix, ".json").replace(tempfile.gettempdir(), "/tmp")
        if os.path.exists(json_path):
            with open(json_path) as f:
                whisper_out = json.load(f)
            text = whisper_out.get("text", "").strip()
        else:
            text = result.stdout.strip()

        return {"text": text, "language_detected": "kn"}
    except FileNotFoundError:
        # Whisper not installed — return placeholder
        return {"text": "", "language_detected": "kn",
                "warning": "Whisper not installed. Run: pip install openai-whisper"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        os.unlink(tmp_path)


@app.post("/ask")
async def ask_free_text(req: TextQueryRequest):
    """Free-form voice query → AI answer about schemes."""
    prompt = f"""You are a helpful Indian government scheme assistant for farmers.
Answer this question briefly in {"Kannada" if req.lang == "kn" else "English"}.
Keep the answer under 3 sentences, very simple language.

Question: {req.query}
"""
    try:
        answer = await call_ollama(prompt)
        return {"response": answer, "lang": req.lang}
    except Exception as e:
        return {"response": "ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ. ದಯವಿಟ್ಟು ಪ್ರಯತ್ನಿಸಿ." if req.lang == "kn"
                else "Information not available. Please try again.", "lang": req.lang}


@app.get("/schemes")
async def list_all_schemes():
    """Return all scheme metadata (for pre-loading in app)."""
    return {"schemes": SCHEMES}


@app.get("/schemes/{scheme_id}")
async def get_scheme(scheme_id: str):
    scheme = next((s for s in SCHEMES if s["id"] == scheme_id), None)
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")
    return scheme
