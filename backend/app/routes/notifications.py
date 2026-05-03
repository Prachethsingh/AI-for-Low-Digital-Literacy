"""
Notification Routes
GET  /api/notifications/{farmer_id}        — Get farmer's notifications
PUT  /api/notifications/{notification_id}/read — Mark as read
POST /api/notifications/broadcast          — Broadcast to all farmers (admin)
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..models import Notification, Farmer, Scheme
from ..schemas import NotificationResponse, MessageResponse

router = APIRouter(prefix="/api/notifications", tags=["Notifications"])


@router.get(
    "/{farmer_id}",
    response_model=List[NotificationResponse],
    summary="Get notifications for a farmer",
)
def get_notifications(
    farmer_id: str,
    unread_only: bool = False,
    db: Session = Depends(get_db),
):
    farmer = db.query(Farmer).filter(Farmer.id == farmer_id).first()
    if not farmer:
        raise HTTPException(status_code=404, detail="Farmer not found")

    query = db.query(Notification).filter(Notification.farmer_id == farmer_id)
    if unread_only:
        query = query.filter(Notification.is_read == False)

    return query.order_by(Notification.created_at.desc()).limit(50).all()


@router.put(
    "/{notification_id}/read",
    response_model=MessageResponse,
    summary="Mark notification as read",
)
def mark_read(notification_id: str, db: Session = Depends(get_db)):
    notif = db.query(Notification).filter(Notification.id == notification_id).first()
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")
    notif.is_read = True
    db.commit()
    return {"message": "Notification marked as read", "success": True}


@router.post(
    "/broadcast",
    response_model=MessageResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Broadcast notification about a new scheme to all farmers",
)
def broadcast_scheme_notification(scheme_id: str, db: Session = Depends(get_db)):
    scheme = db.query(Scheme).filter(Scheme.id == scheme_id).first()
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")

    farmers = db.query(Farmer).filter(Farmer.is_active == True).all()
    count = 0
    for farmer in farmers:
        notif = Notification(
            farmer_id=farmer.id,
            title=f"New Scheme: {scheme.name}",
            title_kn=f"ಹೊಸ ಯೋಜನೆ: {scheme.name_kn}" if scheme.name_kn else None,
            message=(
                f"A new government scheme '{scheme.name}' is now available. "
                f"Benefits: {scheme.benefits[:100]}... Check your eligibility now!"
            ),
            message_kn=(
                f"ಹೊಸ ಸರ್ಕಾರಿ ಯೋಜನೆ '{scheme.name_kn or scheme.name}' ಲಭ್ಯವಿದೆ. "
                "ಈಗಲೇ ನಿಮ್ಮ ಅರ್ಹತೆ ತಪಾಸಣೆ ಮಾಡಿ!"
            ) if scheme.name_kn else None,
            notification_type="new_scheme",
            scheme_id=scheme.id,
        )
        db.add(notif)
        count += 1

    db.commit()
    return {
        "message": f"Notification sent to {count} farmers about '{scheme.name}'",
        "success": True,
    }
