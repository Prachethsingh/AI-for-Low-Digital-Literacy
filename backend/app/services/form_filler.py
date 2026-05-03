"""
Form Pre-Fill Service
======================
Maps farmer profile fields to scheme form fields.
CRITICAL: Only pre-fills NON-SENSITIVE, NON-AUTHENTICATION fields.
         OTP, CAPTCHA, Aadhaar full number are NEVER touched.
"""
from typing import List, Dict, Any, Optional
from ..models import Farmer, Scheme

# ── Sensitive fields NEVER pre-filled ──────────────────────────────────────
SENSITIVE_FIELDS_BLACKLIST = {
    "aadhaar_number",
    "aadhaar_full",
    "otp",
    "password",
    "captcha",
    "pan_number",
    "voter_id_number",
    "passport_number",
    "pin",
    "security_question",
    "biometric",
}

# ── Standard field mapping: form key → farmer model attribute ───────────────
STANDARD_FIELD_MAP: Dict[str, Any] = {
    # Personal
    "full_name":        lambda f: f.full_name,
    "name":             lambda f: f.full_name,
    "applicant_name":   lambda f: f.full_name,
    "first_name":       lambda f: f.full_name.split()[0] if f.full_name else "",
    "last_name":        lambda f: " ".join(f.full_name.split()[1:]) if len(f.full_name.split()) > 1 else "",
    "phone":            lambda f: f.phone,
    "mobile":           lambda f: f.phone,
    "mobile_number":    lambda f: f.phone,
    "email":            lambda f: f.email or "",
    "dob":              lambda f: str(f.date_of_birth) if f.date_of_birth else "",
    "date_of_birth":    lambda f: str(f.date_of_birth) if f.date_of_birth else "",
    "gender":           lambda f: f.gender or "",
    "age":              lambda f: str(f.age()) if f.date_of_birth else "",

    # Location
    "state":            lambda f: f.state,
    "district":         lambda f: f.district,
    "taluk":            lambda f: f.taluk or "",
    "village":          lambda f: f.village or "",
    "pincode":          lambda f: f.pincode or "",
    "pin_code":         lambda f: f.pincode or "",
    "address":          lambda f: f.address or f"{f.village or ''}, {f.district}, {f.state} - {f.pincode or ''}",
    "permanent_address":lambda f: f.address or f"{f.village or ''}, {f.district}, {f.state}",

    # Farm Details
    "land_size":        lambda f: str(f.land_size_hectares),
    "land_area":        lambda f: str(f.land_size_hectares),
    "land_in_hectares": lambda f: str(f.land_size_hectares),
    "land_in_acres":    lambda f: str(round(f.land_size_hectares * 2.471, 2)),
    "farmer_type":      lambda f: f.farmer_type.value if f.farmer_type else "",
    "crop_type":        lambda f: f.primary_crop.value if f.primary_crop else "",
    "primary_crop":     lambda f: f.primary_crop.value if f.primary_crop else "",
    "annual_income":    lambda f: str(int(f.annual_income)) if f.annual_income else "",
    "income":           lambda f: str(int(f.annual_income)) if f.annual_income else "",
    "irrigation_type":  lambda f: f.irrigation_type or "",
    "soil_type":        lambda f: f.soil_type or "",

    # Banking (non-sensitive — account number is shown to farmer for review)
    "bank_account":     lambda f: f.bank_account_number or "",
    "account_number":   lambda f: f.bank_account_number or "",
    "ifsc":             lambda f: f.ifsc_code or "",
    "ifsc_code":        lambda f: f.ifsc_code or "",
}

# ── Human-readable labels ───────────────────────────────────────────────────
FIELD_LABELS: Dict[str, str] = {
    "full_name": "Full Name",
    "name": "Name",
    "applicant_name": "Applicant Name",
    "first_name": "First Name",
    "last_name": "Last Name",
    "phone": "Phone Number",
    "mobile": "Mobile Number",
    "mobile_number": "Mobile Number",
    "email": "Email Address",
    "dob": "Date of Birth",
    "date_of_birth": "Date of Birth",
    "gender": "Gender",
    "age": "Age",
    "state": "State",
    "district": "District",
    "taluk": "Taluk",
    "village": "Village",
    "pincode": "PIN Code",
    "pin_code": "PIN Code",
    "address": "Address",
    "permanent_address": "Permanent Address",
    "land_size": "Land Size (Hectares)",
    "land_area": "Land Area (Hectares)",
    "land_in_hectares": "Land Area (Hectares)",
    "land_in_acres": "Land Area (Acres)",
    "farmer_type": "Farmer Category",
    "crop_type": "Crop Type",
    "primary_crop": "Primary Crop",
    "annual_income": "Annual Income (₹)",
    "income": "Annual Income (₹)",
    "irrigation_type": "Irrigation Type",
    "soil_type": "Soil Type",
    "bank_account": "Bank Account Number",
    "account_number": "Bank Account Number",
    "ifsc": "IFSC Code",
    "ifsc_code": "IFSC Code",
}


def prefill_form(farmer: Farmer, scheme: Scheme) -> Dict[str, Any]:
    """
    Generate pre-filled form data for a farmer + scheme pair.

    Returns a dict with:
      - prefilled_fields: list of {field_key, field_label, value, is_editable}
      - sensitive_fields_excluded: fields we deliberately skipped
      - disclaimer: message for farmer review
    """
    prefillable: Dict[str, str] = scheme.prefillable_fields or {}

    # If scheme has no custom field map, use all standard fields
    if not prefillable:
        prefillable = {k: k for k in STANDARD_FIELD_MAP.keys()}

    prefilled = []
    skipped_sensitive = []

    for field_key, farmer_attr in prefillable.items():
        # Hard block on sensitive fields
        if field_key.lower() in SENSITIVE_FIELDS_BLACKLIST:
            skipped_sensitive.append(field_key)
            continue

        # Try standard map first
        value = None
        if field_key in STANDARD_FIELD_MAP:
            try:
                value = STANDARD_FIELD_MAP[field_key](farmer)
            except Exception:
                value = ""
        elif hasattr(farmer, farmer_attr):
            # Direct attribute access
            attr_val = getattr(farmer, farmer_attr)
            value = str(attr_val) if attr_val is not None else ""
        else:
            continue

        # Skip empty values (farmer must fill those manually)
        if value is None or value == "":
            continue

        prefilled.append({
            "field_key": field_key,
            "field_label": FIELD_LABELS.get(field_key, field_key.replace("_", " ").title()),
            "value": value,
            "is_editable": True,    # Farmer can always edit
            "is_sensitive": False,
        })

    return {
        "prefilled_fields": prefilled,
        "sensitive_fields_excluded": skipped_sensitive,
        "disclaimer": (
            "⚠️ Please review all pre-filled fields carefully before proceeding. "
            "You must handle OTP verification, CAPTCHA, and final form submission yourself. "
            "This system does not automate authentication steps."
        ),
        "confirmation_required": True,
    }
