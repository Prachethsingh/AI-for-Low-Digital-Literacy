"""
Chatbot Routes
POST /api/chat/     — Send a message and get a response
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Optional

from ..database import get_db
from ..models import Farmer
from ..schemas import ChatMessage, ChatResponse
from ..services.chatbot import process_chat_message

router = APIRouter(prefix="/api/chat", tags=["Chatbot"])


@router.post(
    "/",
    response_model=ChatResponse,
    summary="Chat with the AI farming assistant",
    description=(
        "Send a message in English or Kannada and get a response about government schemes, "
        "eligibility, or application process. Optionally provide farmer_id for personalized context."
    ),
)
async def chat(payload: ChatMessage, db: Session = Depends(get_db)):
    # Build farmer context if farmer_id provided
    farmer_context: Optional[dict] = None
    if payload.farmer_id:
        farmer = db.query(Farmer).filter(Farmer.id == payload.farmer_id).first()
        if farmer:
            farmer_context = {
                "name": farmer.full_name,
                "state": farmer.state,
                "land": farmer.land_size_hectares,
                "crop": farmer.primary_crop.value if farmer.primary_crop else "unknown",
                "farmer_type": farmer.farmer_type.value if farmer.farmer_type else "unknown",
            }

    result = await process_chat_message(
        message=payload.message,
        language=payload.language,
        farmer_context=farmer_context,
    )

    return ChatResponse(
        reply=result["reply"],
        language=result["language"],
        suggestions=result.get("suggestions"),
        related_schemes=result.get("related_schemes"),
    )
