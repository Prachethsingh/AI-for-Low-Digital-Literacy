"""
SQLAlchemy ORM Models — Farmer AI Assistant
Tables: farmers, schemes, applications, notifications, documents
"""
import uuid
from datetime import datetime, date
from sqlalchemy import (
    Column, String, Integer, Float, Boolean, Date, DateTime,
    Text, ForeignKey, Enum as SAEnum, JSON
)
from sqlalchemy.orm import relationship
from .database import Base
import enum


# ── Enums ──────────────────────────────────────────────────────────────────

class FarmerType(str, enum.Enum):
    small = "small"           # < 2 hectares
    marginal = "marginal"     # < 1 hectare
    medium = "medium"         # 2-10 hectares
    large = "large"           # > 10 hectares

class CropType(str, enum.Enum):
    rice = "rice"
    wheat = "wheat"
    cotton = "cotton"
    sugarcane = "sugarcane"
    vegetables = "vegetables"
    fruits = "fruits"
    pulses = "pulses"
    oilseeds = "oilseeds"
    mixed = "mixed"
    other = "other"

class ApplicationStatus(str, enum.Enum):
    draft = "draft"
    prefilled = "prefilled"
    submitted = "submitted"
    approved = "approved"
    rejected = "rejected"

class SchemeCategory(str, enum.Enum):
    financial = "financial"
    insurance = "insurance"
    subsidy = "subsidy"
    loan = "loan"
    infrastructure = "infrastructure"
    training = "training"
    equipment = "equipment"
    other = "other"


# ── Models ────────────────────────────────────────────────────────────────

class Farmer(Base):
    __tablename__ = "farmers"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Personal Info
    full_name = Column(String(200), nullable=False)
    phone = Column(String(15), unique=True, nullable=False, index=True)
    email = Column(String(200), nullable=True)
    date_of_birth = Column(Date, nullable=True)
    gender = Column(String(10), nullable=True)

    # Location
    state = Column(String(100), nullable=False)
    district = Column(String(100), nullable=False)
    taluk = Column(String(100), nullable=True)
    village = Column(String(100), nullable=True)
    pincode = Column(String(10), nullable=True)
    address = Column(Text, nullable=True)

    # Farm Details
    land_size_hectares = Column(Float, nullable=False)
    farmer_type = Column(SAEnum(FarmerType), nullable=False)
    primary_crop = Column(SAEnum(CropType), nullable=False)
    secondary_crops = Column(JSON, nullable=True)          # list of crop names
    annual_income = Column(Float, nullable=True)           # in INR
    irrigation_type = Column(String(100), nullable=True)   # drip, flood, rainfed
    soil_type = Column(String(100), nullable=True)

    # Identifiers (stored encrypted in prod; plain for MVP)
    aadhaar_last4 = Column(String(4), nullable=True)       # ONLY last 4 digits
    bank_account_number = Column(String(20), nullable=True)
    ifsc_code = Column(String(11), nullable=True)

    # Status
    is_active = Column(Boolean, default=True)
    preferred_language = Column(String(20), default="en")  # "en" or "kn"

    # Relationships
    documents = relationship("Document", back_populates="farmer", cascade="all, delete-orphan")
    applications = relationship("Application", back_populates="farmer", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="farmer", cascade="all, delete-orphan")

    def age(self) -> int:
        if self.date_of_birth:
            today = date.today()
            return today.year - self.date_of_birth.year - (
                (today.month, today.day) < (self.date_of_birth.month, self.date_of_birth.day)
            )
        return 0


class Scheme(Base):
    __tablename__ = "schemes"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Scheme Info
    name = Column(String(300), nullable=False)
    name_kn = Column(String(300), nullable=True)           # Kannada name
    description = Column(Text, nullable=False)
    description_kn = Column(Text, nullable=True)           # Kannada description
    category = Column(SAEnum(SchemeCategory), nullable=False)
    benefits = Column(Text, nullable=False)
    benefits_kn = Column(Text, nullable=True)

    # Eligibility Rules (stored as structured JSON for the rule engine)
    eligibility_rules = Column(JSON, nullable=False, default=dict)
    # Example:
    # {
    #   "max_land_size": 2.0,
    #   "farmer_types": ["small", "marginal"],
    #   "min_age": 18,
    #   "max_age": 60,
    #   "states": ["Karnataka", "Andhra Pradesh"],
    #   "crops": ["rice", "wheat"],
    #   "max_annual_income": 150000
    # }

    # Required Documents
    required_documents = Column(JSON, nullable=True, default=list)
    # ["Aadhaar Card", "Land Record (RTC)", "Bank Passbook"]

    # Form Fields the system can pre-fill
    prefillable_fields = Column(JSON, nullable=True, default=dict)
    # {"full_name": "farmer.full_name", "address": "farmer.address", ...}

    # Metadata
    issuing_authority = Column(String(200), nullable=True)
    scheme_url = Column(String(500), nullable=True)
    application_start = Column(Date, nullable=True)
    application_deadline = Column(Date, nullable=True)
    is_active = Column(Boolean, default=True)
    max_benefit_amount = Column(Float, nullable=True)      # in INR

    # Relationships
    applications = relationship("Application", back_populates="scheme", cascade="all, delete-orphan")


class Application(Base):
    __tablename__ = "applications"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    farmer_id = Column(String, ForeignKey("farmers.id"), nullable=False)
    scheme_id = Column(String, ForeignKey("schemes.id"), nullable=False)
    status = Column(SAEnum(ApplicationStatus), default=ApplicationStatus.draft)

    # Pre-filled form data (NON-sensitive fields only)
    prefilled_data = Column(JSON, nullable=True, default=dict)
    # Farmer must review and confirm this before submission

    farmer_confirmed = Column(Boolean, default=False)      # farmer reviewed?
    submitted_at = Column(DateTime, nullable=True)
    notes = Column(Text, nullable=True)

    # Relationships
    farmer = relationship("Farmer", back_populates="applications")
    scheme = relationship("Scheme", back_populates="applications")


class Document(Base):
    __tablename__ = "documents"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    created_at = Column(DateTime, default=datetime.utcnow)

    farmer_id = Column(String, ForeignKey("farmers.id"), nullable=False)
    document_type = Column(String(100), nullable=False)   # "aadhaar", "land_record", etc.
    file_path = Column(String(500), nullable=False)        # stored path
    original_filename = Column(String(255), nullable=True)
    is_verified = Column(Boolean, default=False)

    farmer = relationship("Farmer", back_populates="documents")


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    created_at = Column(DateTime, default=datetime.utcnow)

    farmer_id = Column(String, ForeignKey("farmers.id"), nullable=False)
    title = Column(String(300), nullable=False)
    title_kn = Column(String(300), nullable=True)
    message = Column(Text, nullable=False)
    message_kn = Column(Text, nullable=True)
    is_read = Column(Boolean, default=False)
    notification_type = Column(String(50), default="info") # "new_scheme", "deadline", "status"
    scheme_id = Column(String, ForeignKey("schemes.id"), nullable=True)

    farmer = relationship("Farmer", back_populates="notifications")
