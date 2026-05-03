"""
Rule-Based Eligibility Engine
==============================
Evaluates farmer eligibility against scheme rules.

Rule JSON format (stored in schemes.eligibility_rules):
{
    "max_land_size":     2.0,           # hectares
    "min_land_size":     0.1,
    "farmer_types":      ["small", "marginal"],
    "min_age":           18,
    "max_age":           60,
    "states":            ["Karnataka"],
    "districts":         ["Mysuru", "Mandya"],
    "crops":             ["rice", "wheat"],
    "max_annual_income": 150000,
    "min_annual_income": 0,
    "gender":            ["male", "female"],
    "required_irrigation": ["drip"],
    "has_bank_account":  true
}
"""
from typing import Tuple, List, Dict, Any
from datetime import date

from ..models import Farmer, Scheme, FarmerType


def _compute_farmer_type(land_size: float) -> FarmerType:
    """Derive farmer classification from land size (hectares)."""
    if land_size < 1.0:
        return FarmerType.marginal
    elif land_size < 2.0:
        return FarmerType.small
    elif land_size <= 10.0:
        return FarmerType.medium
    else:
        return FarmerType.large


def _farmer_age(farmer: Farmer) -> int:
    if farmer.date_of_birth:
        today = date.today()
        return today.year - farmer.date_of_birth.year - (
            (today.month, today.day) < (farmer.date_of_birth.month, farmer.date_of_birth.day)
        )
    return -1  # unknown


def check_eligibility(
    farmer: Farmer,
    scheme: Scheme,
) -> Tuple[bool, float, List[str], List[str]]:
    """
    Evaluate a single farmer against a scheme's eligibility rules.

    Returns:
        is_eligible (bool)
        match_score (float 0.0–1.0)
        reasons (list of positive reasons)
        missing_criteria (list of failing criteria)
    """
    rules: Dict[str, Any] = scheme.eligibility_rules or {}
    reasons: List[str] = []
    missing: List[str] = []
    total_checks = 0
    passed_checks = 0

    farmer_type = _compute_farmer_type(farmer.land_size_hectares)
    farmer_age = _farmer_age(farmer)

    # ── 1. Land Size ────────────────────────────────────────────────────
    if "max_land_size" in rules:
        total_checks += 1
        limit = rules["max_land_size"]
        if farmer.land_size_hectares <= limit:
            passed_checks += 1
            reasons.append(f"Land size {farmer.land_size_hectares} ha ≤ {limit} ha ✓")
        else:
            missing.append(
                f"Land size {farmer.land_size_hectares} ha exceeds limit of {limit} ha"
            )

    if "min_land_size" in rules:
        total_checks += 1
        limit = rules["min_land_size"]
        if farmer.land_size_hectares >= limit:
            passed_checks += 1
            reasons.append(f"Land size {farmer.land_size_hectares} ha ≥ minimum {limit} ha ✓")
        else:
            missing.append(
                f"Land size {farmer.land_size_hectares} ha is below minimum {limit} ha"
            )

    # ── 2. Farmer Type ──────────────────────────────────────────────────
    if "farmer_types" in rules:
        total_checks += 1
        allowed = [ft.lower() for ft in rules["farmer_types"]]
        if farmer_type.value in allowed:
            passed_checks += 1
            reasons.append(f"Farmer category '{farmer_type.value}' is eligible ✓")
        else:
            missing.append(
                f"Farmer must be {' or '.join(allowed)} (you are {farmer_type.value})"
            )

    # ── 3. Age ──────────────────────────────────────────────────────────
    if "min_age" in rules and farmer_age != -1:
        total_checks += 1
        if farmer_age >= rules["min_age"]:
            passed_checks += 1
            reasons.append(f"Age {farmer_age} ≥ minimum {rules['min_age']} ✓")
        else:
            missing.append(f"Minimum age required: {rules['min_age']} (you are {farmer_age})")

    if "max_age" in rules and farmer_age != -1:
        total_checks += 1
        if farmer_age <= rules["max_age"]:
            passed_checks += 1
            reasons.append(f"Age {farmer_age} ≤ maximum {rules['max_age']} ✓")
        else:
            missing.append(f"Maximum age allowed: {rules['max_age']} (you are {farmer_age})")

    # ── 4. State / Location ─────────────────────────────────────────────
    if "states" in rules:
        total_checks += 1
        allowed_states = [s.lower() for s in rules["states"]]
        if farmer.state.lower() in allowed_states:
            passed_checks += 1
            reasons.append(f"State '{farmer.state}' is covered ✓")
        else:
            missing.append(
                f"Scheme available only in: {', '.join(rules['states'])} (you are in {farmer.state})"
            )

    if "districts" in rules:
        total_checks += 1
        allowed_districts = [d.lower() for d in rules["districts"]]
        if farmer.district and farmer.district.lower() in allowed_districts:
            passed_checks += 1
            reasons.append(f"District '{farmer.district}' is covered ✓")
        else:
            missing.append(
                f"Scheme available only in districts: {', '.join(rules['districts'])}"
            )

    # ── 5. Crop Type ────────────────────────────────────────────────────
    if "crops" in rules:
        total_checks += 1
        allowed_crops = [c.lower() for c in rules["crops"]]
        farmer_crops = [farmer.primary_crop.value.lower()]
        if farmer.secondary_crops:
            farmer_crops += [c.lower() for c in farmer.secondary_crops]

        if any(c in allowed_crops for c in farmer_crops):
            passed_checks += 1
            reasons.append(f"Crop type matches scheme requirements ✓")
        else:
            missing.append(
                f"Scheme is for: {', '.join(rules['crops'])} crops only"
            )

    # ── 6. Annual Income ────────────────────────────────────────────────
    if "max_annual_income" in rules and farmer.annual_income is not None:
        total_checks += 1
        limit = rules["max_annual_income"]
        if farmer.annual_income <= limit:
            passed_checks += 1
            reasons.append(
                f"Annual income ₹{farmer.annual_income:,.0f} ≤ ₹{limit:,.0f} limit ✓"
            )
        else:
            missing.append(
                f"Annual income ₹{farmer.annual_income:,.0f} exceeds limit ₹{limit:,.0f}"
            )

    # ── 7. Gender ───────────────────────────────────────────────────────
    if "gender" in rules and farmer.gender:
        total_checks += 1
        allowed_genders = [g.lower() for g in rules["gender"]]
        if farmer.gender.lower() in allowed_genders:
            passed_checks += 1
            reasons.append(f"Gender eligibility met ✓")
        else:
            missing.append(f"Scheme is restricted to: {', '.join(rules['gender'])}")

    # ── 8. Bank Account ─────────────────────────────────────────────────
    if rules.get("has_bank_account"):
        total_checks += 1
        if farmer.bank_account_number:
            passed_checks += 1
            reasons.append("Bank account linked ✓")
        else:
            missing.append("Bank account number required for this scheme")

    # ── 9. Deadline check ───────────────────────────────────────────────
    if scheme.application_deadline:
        if scheme.application_deadline < date.today():
            missing.append(f"⚠️ Application deadline passed: {scheme.application_deadline}")
            # Still eligible by farmer criteria but deadline lapsed

    # ── Compute Score ───────────────────────────────────────────────────
    if total_checks == 0:
        # No rules defined = open to all
        match_score = 1.0
        is_eligible = True
        reasons.append("Open scheme — no specific eligibility restrictions ✓")
    else:
        match_score = round(passed_checks / total_checks, 2)
        is_eligible = len(missing) == 0

    return is_eligible, match_score, reasons, missing


def run_eligibility_check_all(
    farmer: Farmer,
    schemes: List[Scheme],
) -> Dict[str, Any]:
    """Check a farmer against all active schemes, return sorted results."""
    eligible = []
    ineligible = []

    for scheme in schemes:
        if not scheme.is_active:
            continue
        is_eligible, score, reasons, missing = check_eligibility(farmer, scheme)
        result = {
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
        if is_eligible:
            eligible.append(result)
        else:
            ineligible.append(result)

    # Sort eligible by score descending
    eligible.sort(key=lambda x: x["match_score"], reverse=True)
    ineligible.sort(key=lambda x: x["match_score"], reverse=True)

    return {
        "farmer_id": farmer.id,
        "farmer_name": farmer.full_name,
        "total_schemes_checked": len(schemes),
        "eligible_schemes": eligible,
        "ineligible_schemes": ineligible,
    }
