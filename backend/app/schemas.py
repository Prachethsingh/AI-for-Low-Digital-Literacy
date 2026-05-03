"""
Pydantic schemas for request/response validation.
Separate schemas for Create, Update, and Response payloads.
"""
from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional, List, Dict, Any
from datetime import date, datetime
from .models import FarmerType, CropType, ApplicationStatus, SchemeCategory


# ═══════════════════════════════════════════════════════
#  FARMER SCHEMAS
# ═══════════════════════════════════════════════════════

class FarmerCreate(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=200, examples=["Rajesh Kumar"])
    phone: str = Field(..., pattern=r"^\+?[6-9]\d{9}$", examples=["9876543210"])
    email: Optional[EmailStr] = None
    date_of_birth: Optional[date] = None
    gender: Optional[str] = Field(None, pattern="^(male|female|other)$")

    # Location
    state: str = Field(..., min_length=2, max_length=100, examples=["Karnataka"])
    district: str = Field(..., min_length=2, max_length=100, examples=["Mysuru"])
    taluk: Optional[str] = None
    village: Optional[str] = None
    pincode: Optional[str] = Field(None, pattern=r"^\d{6}$")
    address: Optional[str] = None

    # Farm Details
    land_size_hectares: float = Field(..., gt=0, le=1000, examples=[1.5])
    primary_crop: CropType
    secondary_crops: Optional[List[str]] = None
    annual_income: Optional[float] = Field(None, ge=0)
    irrigation_type: Optional[str] = None
    soil_type: Optional[str] = None

    # Banking (optional)
    bank_account_number: Optional[str] = None
    ifsc_code: Optional[str] = Field(None, pattern=r"^[A-Z]{4}0[A-Z0-9]{6}$")

    preferred_language: str = Field(default="en", pattern="^(en|kn)$")

    @field_validator("land_size_hectares")
    @classmethod
    def compute_farmer_type(cls, v):
        return v  # farmer_type is computed in the service layer

    model_config = {"from_attributes": True}


class FarmerUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    address: Optional[str] = None
    land_size_hectares: Optional[float] = Field(None, gt=0)
    primary_crop: Optional[CropType] = None
    secondary_crops: Optional[List[str]] = None
    annual_income: Optional[float] = None
    irrigation_type: Optional[str] = None
    bank_account_number: Optional[str] = None
    ifsc_code: Optional[str] = None
    preferred_language: Optional[str] = None


class FarmerResponse(BaseModel):
    id: str
    full_name: str
    phone: str
    email: Optional[str]
    state: str
    district: str
    taluk: Optional[str]
    village: Optional[str]
    land_size_hectares: float
    farmer_type: FarmerType
    primary_crop: CropType
    secondary_crops: Optional[List[str]]
    annual_income: Optional[float]
    preferred_language: str
    created_at: datetime

    model_config = {"from_attributes": True}


# ═══════════════════════════════════════════════════════
#  SCHEME SCHEMAS
# ═══════════════════════════════════════════════════════

class SchemeCreate(BaseModel):
    name: str = Field(..., min_length=3)
    name_kn: Optional[str] = None
    description: str = Field(..., min_length=10)
    description_kn: Optional[str] = None
    category: SchemeCategory
    benefits: str
    benefits_kn: Optional[str] = None
    eligibility_rules: Dict[str, Any] = Field(default_factory=dict)
    required_documents: Optional[List[str]] = None
    prefillable_fields: Optional[Dict[str, str]] = None
    issuing_authority: Optional[str] = None
    scheme_url: Optional[str] = None
    application_start: Optional[date] = None
    application_deadline: Optional[date] = None
    max_benefit_amount: Optional[float] = None

    model_config = {"from_attributes": True}


class SchemeResponse(BaseModel):
    id: str
    name: str
    name_kn: Optional[str]
    description: str
    description_kn: Optional[str]
    category: SchemeCategory
    benefits: str
    benefits_kn: Optional[str]
    eligibility_rules: Dict[str, Any]
    required_documents: Optional[List[str]]
    issuing_authority: Optional[str]
    scheme_url: Optional[str]
    application_start: Optional[date]
    application_deadline: Optional[date]
    max_benefit_amount: Optional[float]
    is_active: bool
    created_at: datetime

    model_config = {"from_attributes": True}


# ═══════════════════════════════════════════════════════
#  ELIGIBILITY SCHEMAS
# ═══════════════════════════════════════════════════════

class EligibilityResult(BaseModel):
    scheme_id: str
    scheme_name: str
    scheme_name_kn: Optional[str]
    is_eligible: bool
    match_score: float = Field(..., ge=0.0, le=1.0, description="0.0–1.0 confidence score")
    reasons: List[str]                # Why eligible or not
    missing_criteria: List[str]       # What the farmer is missing
    required_documents: Optional[List[str]]
    deadline: Optional[date]
    max_benefit: Optional[float]


class EligibilityResponse(BaseModel):
    farmer_id: str
    farmer_name: str
    total_schemes_checked: int
    eligible_schemes: List[EligibilityResult]
    ineligible_schemes: List[EligibilityResult]


# ═══════════════════════════════════════════════════════
#  FORM PREFILL SCHEMAS
# ═══════════════════════════════════════════════════════

class PrefillRequest(BaseModel):
    farmer_id: str
    scheme_id: str


class PrefillField(BaseModel):
    field_key: str
    field_label: str
    value: Any
    is_editable: bool = True          # Farmer can always edit pre-filled values
    is_sensitive: bool = False


class PrefillResponse(BaseModel):
    farmer_id: str
    scheme_id: str
    scheme_name: str
    prefilled_fields: List[PrefillField]
    sensitive_fields_excluded: List[str]  # Fields we deliberately skipped
    disclaimer: str
    confirmation_required: bool = True


class FormConfirmRequest(BaseModel):
    farmer_id: str
    scheme_id: str
    confirmed_data: Dict[str, Any]    # Farmer's final reviewed data


# ═══════════════════════════════════════════════════════
#  CHATBOT SCHEMAS
# ═══════════════════════════════════════════════════════

class ChatMessage(BaseModel):
    farmer_id: Optional[str] = None
    message: str = Field(..., min_length=1, max_length=1000)
    language: str = Field(default="en", pattern="^(en|kn)$")


class ChatResponse(BaseModel):
    reply: str
    language: str
    suggestions: Optional[List[str]] = None  # Follow-up question suggestions
    related_schemes: Optional[List[str]] = None


# ═══════════════════════════════════════════════════════
#  NOTIFICATION SCHEMAS
# ═══════════════════════════════════════════════════════

class NotificationResponse(BaseModel):
    id: str
    title: str
    title_kn: Optional[str]
    message: str
    message_kn: Optional[str]
    is_read: bool
    notification_type: str
    created_at: datetime

    model_config = {"from_attributes": True}


# ═══════════════════════════════════════════════════════
#  GENERIC RESPONSE
# ═══════════════════════════════════════════════════════

class MessageResponse(BaseModel):
    message: str
    success: bool = True
