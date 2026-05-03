"""
Farmer AI Assistant — FastAPI Application Entry Point
=====================================================
Run with: uvicorn main:app --reload
API Docs: http://localhost:8000/docs
Frontend:  http://localhost:8000/app
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
import os

from app.config import settings
from app.database import engine, Base
from app.routes import farmers, schemes, eligibility, forms, chat, notifications

# ── Create all DB tables ──────────────────────────────────────────────────
Base.metadata.create_all(bind=engine)

# ── FastAPI App ───────────────────────────────────────────────────────────
app = FastAPI(
    title=settings.APP_NAME,
    description=(
        "🌾 AI-powered assistant that helps Indian farmers discover government schemes, "
        "check eligibility using rule-based AI, and pre-fill application forms. "
        "\n\n**⚠️ Important**: This system NEVER automates OTP, CAPTCHA, or authentication. "
        "All sensitive steps require farmer action."
    ),
    version="1.0.0",
    contact={
        "name": "Farmer AI Assistant",
        "email": "support@farmerai.in",
    },
    license_info={"name": "MIT"},
    docs_url="/docs",
    redoc_url="/redoc",
)

# ── CORS ──────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list + ["*"],  # Tighten in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Register Routers ──────────────────────────────────────────────────────
app.include_router(farmers.router)
app.include_router(schemes.router)
app.include_router(eligibility.router)
app.include_router(forms.router)
app.include_router(chat.router)
app.include_router(notifications.router)

# ── Serve Frontend (after API routes to avoid conflicts) ──────────────────
FRONTEND_DIR = os.path.join(os.path.dirname(__file__), "..", "frontend")
if os.path.exists(FRONTEND_DIR):
    app.mount("/app", StaticFiles(directory=FRONTEND_DIR, html=True), name="frontend")


# ── Root Endpoint ─────────────────────────────────────────────────────────
@app.get("/", tags=["Health"])
def root():
    # If frontend exists serve it, otherwise return JSON info
    index_path = os.path.join(os.path.dirname(__file__), "..", "frontend", "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    return {
        "app": settings.APP_NAME,
        "version": "1.0.0",
        "status": "running",
        "frontend": "http://localhost:8000/app",
        "docs": "/docs",
        "endpoints": {
            "farmers": "/api/farmers/register",
            "schemes": "/api/schemes/",
            "eligibility": "/api/eligibility/{farmer_id}",
            "prefill_form": "/api/forms/prefill",
            "chatbot": "/api/chat/",
            "notifications": "/api/notifications/{farmer_id}",
            "seed_data": "POST /api/schemes/seed",
        },
        "disclaimer": (
            "This system assists farmers but does NOT automate OTP, CAPTCHA, "
            "or any government authentication. All submissions are farmer-controlled."
        ),
    }


@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "healthy", "environment": settings.APP_ENV}
