"""
Form Pre-Fill Routes
POST /api/forms/prefill           — Generate pre-filled form data
POST /api/forms/confirm           — Farmer confirms reviewed data → creates Application
GET  /api/forms/applications/{farmer_id}  — Get farmer's applications
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List

from ..database import get_db
from ..models import Farmer, Scheme, Application, ApplicationStatus
from ..schemas import (
    PrefillRequest, PrefillResponse, PrefillField,
    FormConfirmRequest, MessageResponse
)
from ..services.form_filler import prefill_form
from ..services.eligibility import check_eligibility

router = APIRouter(prefix="/api/forms", tags=["Form Filling"])


@router.post(
    "/prefill",
    response_model=PrefillResponse,
    summary="Pre-fill form with farmer data",
    description=(
        "Generates a preview of form fields pre-filled from the farmer's profile. "
        "ONLY non-sensitive fields are included. OTP, CAPTCHA, and authentication "
        "fields are NEVER pre-filled. Farmer must review before confirming."
    ),
)
def prefill_form_endpoint(payload: PrefillRequest, db: Session = Depends(get_db)):
    farmer = db.query(Farmer).filter(Farmer.id == payload.farmer_id).first()
    if not farmer:
        raise HTTPException(status_code=404, detail="Farmer not found")

    scheme = db.query(Scheme).filter(Scheme.id == payload.scheme_id).first()
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")

    # Run eligibility check before pre-filling
    is_eligible, score, reasons, missing = check_eligibility(farmer, scheme)
    if not is_eligible:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={
                "message": "Farmer does not meet eligibility criteria for this scheme",
                "missing_criteria": missing,
                "match_score": score,
            },
        )

    # Generate pre-fill data
    result = prefill_form(farmer, scheme)

    # Convert to response model
    prefilled_fields = [
        PrefillField(**field) for field in result["prefilled_fields"]
    ]

    return PrefillResponse(
        farmer_id=farmer.id,
        scheme_id=scheme.id,
        scheme_name=scheme.name,
        prefilled_fields=prefilled_fields,
        sensitive_fields_excluded=result["sensitive_fields_excluded"],
        disclaimer=result["disclaimer"],
        confirmation_required=True,
    )


@router.post(
    "/confirm",
    response_model=MessageResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Farmer confirms reviewed pre-filled data",
    description=(
        "Farmer has reviewed the pre-filled data and confirms it. "
        "This creates an Application record. Farmer must then complete "
        "OTP and final submission on the official government portal."
    ),
)
def confirm_form(payload: FormConfirmRequest, db: Session = Depends(get_db)):
    farmer = db.query(Farmer).filter(Farmer.id == payload.farmer_id).first()
    if not farmer:
        raise HTTPException(status_code=404, detail="Farmer not found")

    scheme = db.query(Scheme).filter(Scheme.id == payload.scheme_id).first()
    if not scheme:
        raise HTTPException(status_code=404, detail="Scheme not found")

    # Check if application already exists
    existing = db.query(Application).filter(
        Application.farmer_id == payload.farmer_id,
        Application.scheme_id == payload.scheme_id,
        Application.status.notin_([ApplicationStatus.rejected]),
    ).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Application already exists with status: {existing.status.value}",
        )

    application = Application(
        farmer_id=payload.farmer_id,
        scheme_id=payload.scheme_id,
        prefilled_data=payload.confirmed_data,
        farmer_confirmed=True,
        status=ApplicationStatus.prefilled,
    )
    db.add(application)
    db.commit()

    return {
        "message": (
            f"Application saved successfully for '{scheme.name}'. "
            "Please proceed to the official government portal to complete OTP verification "
            "and final submission. Application ID: " + application.id
        ),
        "success": True,
    }


@router.get(
    "/applications/{farmer_id}",
    summary="Get all applications for a farmer",
)
def get_applications(farmer_id: str, db: Session = Depends(get_db)):
    farmer = db.query(Farmer).filter(Farmer.id == farmer_id).first()
    if not farmer:
        raise HTTPException(status_code=404, detail="Farmer not found")

    applications = (
        db.query(Application)
        .filter(Application.farmer_id == farmer_id)
        .order_by(Application.created_at.desc())
        .all()
    )

    result = []
    for app in applications:
        scheme = db.query(Scheme).filter(Scheme.id == app.scheme_id).first()
        result.append({
            "application_id": app.id,
            "scheme_id": app.scheme_id,
            "scheme_name": scheme.name if scheme else "Unknown",
            "status": app.status.value,
            "farmer_confirmed": app.farmer_confirmed,
            "created_at": app.created_at.isoformat(),
            "prefilled_fields_count": len(app.prefilled_data or {}),
        })

    return {"farmer_id": farmer_id, "applications": result, "total": len(result)}
