"""
Government Scheme definitions with Ultra-Depth Metadata.
Each entry contains detailed eligibility, requirements, and steps.
"""

SCHEMES = [
    {
        "id": "pmkisan",
        "name_kn": "ಪಿಎಂ-ಕಿಸಾನ್ (ಕೃಷಿ ಸಮ್ಮಾನ್ ನಿಧಿ)",
        "name_en": "PM-KISAN (Samman Nidhi)",
        "tagline_kn": "ವರ್ಷಕ್ಕೆ ₹6,000 ನೇರ ಆದಾಯ",
        "tagline_en": "₹6,000 per year direct income",
        "description_en": "Direct income support for all landholding farmer families across the country.",
        "benefits": [
            "₹6,000 yearly in three equal installments.",
            "Direct Benefit Transfer (DBT) to bank accounts.",
            "Covers all small and marginal farmers."
        ],
        "eligibility": [
            "Must be an Indian citizen.",
            "Must own cultivable land.",
            "Not a government employee or high income taxpayer."
        ],
        "documents": ["Aadhaar Card", "Land Ownership Documents (Pahani)", "Bank Passbook", "Mobile Number"],
        "steps": ["Registration on Portal", "Aadhaar Verification", "e-KYC Completion", "Approval by Nodal Officer"],
        "icon": "💰",
        "color": "#2E7D32",
        "category": "money",
        "requires_farmer": True,
        "requires_aadhaar": True,
        "helpline": "155261",
    },
    {
        "id": "pmfby",
        "name_kn": "ಪ್ರಧಾನ ಮಂತ್ರಿ ಫಸಲ್ ಬಿಮಾ ಯೋಜನೆ",
        "name_en": "PMFBY – Crop Insurance",
        "tagline_en": "Comprehensive risk coverage for crops",
        "description_en": "Insurance service for farmers for their yields against natural calamities.",
        "benefits": [
            "Full insurance cover against non-preventable natural risks.",
            "Low premium rates (1.5% to 2% for food crops).",
            "Immediate partial claim payment within 72 hours of damage."
        ],
        "eligibility": [
            "All farmers including sharecroppers and tenant farmers.",
            "Crops must be notified in the specific area."
        ],
        "documents": ["Aadhaar Card", "Land Records", "Sowing Certificate", "Bank Account Details"],
        "steps": ["Enrollment at Bank/CSC", "Premium Payment", "Verification of Sowing", "Claim if loss occurs"],
        "icon": "🌧️",
        "color": "#1565C0",
        "category": "farmer",
        "requires_farmer": True,
        "requires_aadhaar": True,
        "helpline": "14447",
    },
    {
        "id": "kcc",
        "name_kn": "ಕಿಸಾನ್ ಕ್ರೆಡಿಟ್ ಕಾರ್ಡ್",
        "name_en": "Kisan Credit Card (KCC)",
        "tagline_en": "Flexible credit support for farmers",
        "description_en": "Timely access to credit for cultivation and maintenance of crops.",
        "benefits": [
            "Low interest rate (approx 4% with timely repayment).",
            "Credit limit based on land holding and crop pattern.",
            "Insurance coverage for the card holder."
        ],
        "eligibility": [
            "All farmers (Individuals/Joint borrowers).",
            "Tenant farmers and oral lessees.",
            "Self-help groups of farmers."
        ],
        "documents": ["Aadhaar Card", "Voter ID/PAN", "Land Records", "Recent Passport Photo"],
        "steps": ["Apply at any Bank Branch", "Land Verification", "Credit Scoring", "Card Issuance"],
        "icon": "💳",
        "color": "#6A1B9A",
        "category": "money",
        "requires_farmer": True,
        "requires_aadhaar": True,
        "helpline": "1800-180-1551",
    },
    {
        "id": "pmksy",
        "name_kn": "ಪಿಎಂ ಕೃಷಿ ಸಿಂಚಾಯಿ ಯೋಜನೆ",
        "name_en": "PMKSY – Irrigation",
        "tagline_en": "Har Khet Ko Pani (Water for every farm)",
        "description_en": "Focused on creating sources of assured irrigation and protective irrigation.",
        "benefits": [
            "Up to 90% subsidy for drip and sprinkler systems.",
            "Improved water use efficiency on the farm.",
            "Reduction in input costs and labor."
        ],
        "eligibility": [
            "Farmers having own land with valid water source.",
            "Priority for SC/ST and Women farmers."
        ],
        "documents": ["Aadhaar", "Pahani/Land Record", "Bank Passbook", "Cast Certificate (if applicable)"],
        "steps": ["Submit application at Agriculture Dept", "Technical Survey", "Installation by approved vendor", "Verification & Subsidy Release"],
        "icon": "💧",
        "color": "#00838F",
        "category": "farmer",
        "requires_farmer": True,
        "requires_aadhaar": False,
        "helpline": "1800-180-1551",
    }
]

# Pre-written audio scripts for schemes (Kannada TTS text)
SCHEME_AUDIO_SCRIPTS = {
    "pmkisan": "ಪಿಎಂ ಕಿಸಾನ್ ಯೋಜನೆ. ನೀವು ರೈತರಾಗಿದ್ದರೆ ವರ್ಷಕ್ಕೆ ಆರು ಸಾವಿರ ರೂಪಾಯಿ ನಿಮ್ಮ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ಬರುತ್ತದೆ.",
    "pmfby": "ಪ್ರಧಾನ ಮಂತ್ರಿ ಫಸಲ್ ಬಿಮಾ ಯೋಜನೆ. ನಿಮ್ಮ ಬೆಳೆ ನಾಶವಾದರೆ ಸರ್ಕಾರ ಪರಿಹಾರ ಕೊಡುತ್ತದೆ.",
    "kcc": "ಕಿಸಾನ್ ಕ್ರೆಡಿಟ್ ಕಾರ್ಡ್. ಕಡಿಮೆ ಬಡ್ಡಿ ದರದಲ್ಲಿ ಕೃಷಿ ಸಾಲ ಪಡೆಯಿರಿ.",
}
