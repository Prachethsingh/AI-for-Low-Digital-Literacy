"""
Eligibility Check Routes
GET  /api/eligibility/{farmer_id}                  — Check against ALL schemes
GET  /api/eligibility/{farmer_id}/{scheme_id}      — Check against ONE specific scheme
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Farmer, Scheme
from ..schemas import EligibilityResponse, EligibilityResult
from ..services.eligibility import run_eligibility_check_all, check_eligibility

router = APIRouter(prefix="/api/eligibility", tags=["Eligibility"])


@router.get(
    "/{farmer_id}",
    response_model=EligibilityResponse,
    summary="Check farmer eligibility against all schemes",
    description=(
        "Runs the rule-based eligibility engine against every active scheme. "
        "Returns a sorted list of eligible and ineligible schemes with reasons."
    ),
)
def check_all_eligibility(farmer_id: str, db: Session = Depends(get_db)):
    farmer = db.query(Farmer).filter(Farmer.id == farmer_id).first()
    if not farmer:
        raise HTTPException(status_code=404, detail="Farmer not found")

    schemes = db.query(Scheme).filter(Scheme.is_active == True).all()
    if not schemes:
        raise HTTPException(
            status_code=404,
            detail="No active schemes found. Please seed the database first via POST /api/schemes/seed",
        )

    result = run_eligibility_check_all(farmer, schemes)
    return result


@router.get(
    "/{farmer_id}/{scheme_id}",
    response_model=EligibilityResult,
    summary="Check eligibility for a specific scheme",
)
def check_single_eligibility(farmer_id: str, scheme_id: str, db: Session = Depends(get_db)):
    farmer = db.query(Farmer).filter(Farmer.id == farmer_id).first()
    if not farmer:
        raise HTTPException(status_code=404, detail="Farmer not found")

    scheme = db.query(Scheme).filter(Scheme.id == scheme_id).first()
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")

    is_eligible, score, reasons, missing = check_eligibility(farmer, scheme)

    return {
        "scheme_id": scheme.id,
        "scheme_name": scheme.name,
        "scheme_name_kn": scheme.name_kn,
        "is_eligible": is_eligible,
        "match_score": score,
        "reasons": reasons,
        "missing_criteria": missing,
        "required_documents": scheme.required_documents,
        "deadline": scheme.application_deadline,
        "max_benefit": scheme.max_benefit_amount,
    }
