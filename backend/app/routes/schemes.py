"""
Scheme Management Routes
GET  /api/schemes/              — List all active schemes
GET  /api/schemes/{scheme_id}   — Get scheme details
POST /api/schemes/              — Add new scheme (admin)
PUT  /api/schemes/{scheme_id}   — Update scheme (admin)
POST /api/schemes/seed          — Seed sample data
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from ..database import get_db
from ..models import Scheme
from ..schemas import SchemeCreate, SchemeResponse, MessageResponse
from ..services.seed_data import SAMPLE_SCHEMES

router = APIRouter(prefix="/api/schemes", tags=["Schemes"])


@router.get(
    "/",
    response_model=List[SchemeResponse],
    summary="List all active government schemes",
)
def get_schemes(
    category: Optional[str] = None,
    state: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    query = db.query(Scheme).filter(Scheme.is_active == True)

    if category:
        query = query.filter(Scheme.category == category)

    schemes = query.offset(skip).limit(limit).all()

    # Filter by state if provided (check in eligibility_rules JSON)
    if state:
        schemes = [
            s for s in schemes
            if not s.eligibility_rules.get("states")
            or state in s.eligibility_rules["states"]
        ]

    return schemes


@router.get(
    "/{scheme_id}",
    response_model=SchemeResponse,
    summary="Get a specific scheme",
)
def get_scheme(scheme_id: str, db: Session = Depends(get_db)):
    scheme = db.query(Scheme).filter(Scheme.id == scheme_id).first()
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")
    return scheme


@router.post(
    "/",
    response_model=SchemeResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Add a new scheme (admin)",
)
def create_scheme(payload: SchemeCreate, db: Session = Depends(get_db)):
    scheme = Scheme(**payload.model_dump())
    db.add(scheme)
    db.commit()
    db.refresh(scheme)
    return scheme


@router.put(
    "/{scheme_id}",
    response_model=SchemeResponse,
    summary="Update scheme details (admin)",
)
def update_scheme(scheme_id: str, payload: SchemeCreate, db: Session = Depends(get_db)):
    scheme = db.query(Scheme).filter(Scheme.id == scheme_id).first()
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")

    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(scheme, key, value)

    db.commit()
    db.refresh(scheme)
    return scheme


@router.delete(
    "/{scheme_id}",
    response_model=MessageResponse,
    summary="Deactivate a scheme",
)
def deactivate_scheme(scheme_id: str, db: Session = Depends(get_db)):
    scheme = db.query(Scheme).filter(Scheme.id == scheme_id).first()
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")
    scheme.is_active = False
    db.commit()
    return {"message": "Scheme deactivated", "success": True}


@router.post(
    "/seed",
    response_model=MessageResponse,
    summary="Seed database with sample schemes",
    description="Loads 5 sample government schemes for MVP testing. Skip if schemes already exist.",
)
def seed_schemes(db: Session = Depends(get_db)):
    existing_count = db.query(Scheme).count()
    if existing_count > 0:
        return {
            "message": f"Database already has {existing_count} schemes. Skipping seed.",
            "success": True,
        }

    for scheme_data in SAMPLE_SCHEMES:
        scheme = Scheme(**scheme_data)
        db.add(scheme)

    db.commit()
    return {
        "message": f"Successfully seeded {len(SAMPLE_SCHEMES)} sample schemes",
        "success": True,
    }
