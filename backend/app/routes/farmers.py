"""
Farmer Registration & Profile Routes
POST /api/farmers/register
GET  /api/farmers/{farmer_id}
PUT  /api/farmers/{farmer_id}
GET  /api/farmers/  (list, admin)
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from ..database import get_db
from ..models import Farmer, FarmerType
from ..schemas import FarmerCreate, FarmerUpdate, FarmerResponse, MessageResponse

router = APIRouter(prefix="/api/farmers", tags=["Farmers"])


def _compute_farmer_type(land_size: float) -> FarmerType:
    if land_size < 1.0:
        return FarmerType.marginal
    elif land_size < 2.0:
        return FarmerType.small
    elif land_size <= 10.0:
        return FarmerType.medium
    return FarmerType.large


@router.post(
    "/register",
    response_model=FarmerResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new farmer",
    description="Creates a new farmer profile. Phone number must be unique.",
)
def register_farmer(payload: FarmerCreate, db: Session = Depends(get_db)):
    # Check for duplicate phone
    existing = db.query(Farmer).filter(Farmer.phone == payload.phone).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"A farmer with phone {payload.phone} already exists. Use the update endpoint.",
        )

    farmer_data = payload.model_dump()
    farmer_data["farmer_type"] = _compute_farmer_type(payload.land_size_hectares)

    farmer = Farmer(**farmer_data)
    db.add(farmer)
    db.commit()
    db.refresh(farmer)
    return farmer


@router.get(
    "/{farmer_id}",
    response_model=FarmerResponse,
    summary="Get farmer profile",
)
def get_farmer(farmer_id: str, db: Session = Depends(get_db)):
    farmer = db.query(Farmer).filter(Farmer.id == farmer_id).first()
    if not farmer:
        raise HTTPException(status_code=404, detail="Farmer not found")
    return farmer


@router.put(
    "/{farmer_id}",
    response_model=FarmerResponse,
    summary="Update farmer profile",
)
def update_farmer(farmer_id: str, payload: FarmerUpdate, db: Session = Depends(get_db)):
    farmer = db.query(Farmer).filter(Farmer.id == farmer_id).first()
    if not farmer:
        raise HTTPException(status_code=404, detail="Farmer not found")

    update_data = payload.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(farmer, key, value)

    # Recompute farmer type if land size changed
    if "land_size_hectares" in update_data:
        farmer.farmer_type = _compute_farmer_type(farmer.land_size_hectares)

    db.commit()
    db.refresh(farmer)
    return farmer


@router.delete(
    "/{farmer_id}",
    response_model=MessageResponse,
    summary="Deactivate farmer account",
)
def deactivate_farmer(farmer_id: str, db: Session = Depends(get_db)):
    farmer = db.query(Farmer).filter(Farmer.id == farmer_id).first()
    if not farmer:
        raise HTTPException(status_code=404, detail="Farmer not found")
    farmer.is_active = False
    db.commit()
    return {"message": "Farmer account deactivated", "success": True}


@router.get(
    "/",
    response_model=List[FarmerResponse],
    summary="List all farmers (admin)",
)
def list_farmers(skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    return db.query(Farmer).filter(Farmer.is_active == True).offset(skip).limit(limit).all()


@router.post(
    "/login",
    response_model=FarmerResponse,
    summary="Login with phone number",
    description="Looks up a registered farmer by phone number. Returns farmer profile if found.",
)
def login_farmer(payload: dict, db: Session = Depends(get_db)):
    phone = payload.get("phone", "").strip()
    if not phone:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Phone number is required")
    farmer = db.query(Farmer).filter(Farmer.phone == phone, Farmer.is_active == True).first()
    if not farmer:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No account found with this phone number. Please register first.",
        )
    return farmer

