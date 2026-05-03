"""
Seed Data — Sample Government Schemes
Run this to populate the schemes table for MVP demo.
"""
from ..models import Scheme, SchemeCategory

SAMPLE_SCHEMES = [
    {
        "name": "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
        "name_kn": "ಪ್ರಧಾನ ಮಂತ್ರಿ ಕಿಸಾನ್ ಸಮ್ಮಾನ ನಿಧಿ",
        "description": (
            "Direct income support of ₹6,000 per year to all small and marginal farmers. "
            "Amount is paid in three equal installments of ₹2,000 directly to bank accounts."
        ),
        "description_kn": (
            "ಸಣ್ಣ ಮತ್ತು ಅತಿ ಸಣ್ಣ ರೈತರಿಗೆ ವಾರ್ಷಿಕ ₹6,000 ನೇರ ಆದಾಯ ಬೆಂಬಲ. "
            "ಮೊತ್ತವನ್ನು ₹2,000 ರ ಮೂರು ಕಂತುಗಳಲ್ಲಿ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ನೇರವಾಗಿ ಜಮಾ ಮಾಡಲಾಗುತ್ತದೆ."
        ),
        "category": SchemeCategory.financial,
        "benefits": "₹6,000 per year (₹2,000 × 3 installments) directly credited to bank account",
        "benefits_kn": "ವಾರ್ಷಿಕ ₹6,000 (₹2,000 × 3 ಕಂತುಗಳು) ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ನೇರ ಜಮಾ",
        "eligibility_rules": {
            "max_land_size": 2.0,
            "farmer_types": ["small", "marginal"],
            "has_bank_account": True,
        },
        "required_documents": [
            "Aadhaar Card",
            "Land Record (RTC / 7-12 Extract)",
            "Bank Passbook (first page)",
            "Passport-size photograph",
        ],
        "prefillable_fields": {
            "applicant_name": "full_name",
            "mobile_number": "phone",
            "state": "state",
            "district": "district",
            "address": "address",
            "land_in_hectares": "land_size_hectares",
            "crop_type": "primary_crop",
            "account_number": "bank_account_number",
            "ifsc_code": "ifsc_code",
        },
        "issuing_authority": "Ministry of Agriculture & Farmers Welfare, Government of India",
        "scheme_url": "https://pmkisan.gov.in",
        "max_benefit_amount": 6000.0,
    },
    {
        "name": "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
        "name_kn": "ಪ್ರಧಾನ ಮಂತ್ರಿ ಫಸಲ್ ಬಿಮಾ ಯೋಜನೆ",
        "description": (
            "Comprehensive crop insurance scheme providing financial support to farmers "
            "suffering crop loss/damage due to unforeseen events like natural calamities, "
            "pests and diseases."
        ),
        "description_kn": (
            "ನೈಸರ್ಗಿಕ ವಿಪತ್ತುಗಳು, ಕೀಟ ಮತ್ತು ರೋಗಗಳಿಂದ ಬೆಳೆ ನಷ್ಟ ಅನುಭವಿಸುವ "
            "ರೈತರಿಗೆ ಆರ್ಥಿಕ ಬೆಂಬಲ ನೀಡುವ ಸಮಗ್ರ ಬೆಳೆ ವಿಮೆ ಯೋಜನೆ."
        ),
        "category": SchemeCategory.insurance,
        "benefits": "Full sum insured for crop loss. Premium: 2% for Kharif, 1.5% for Rabi, 5% for commercial crops",
        "benefits_kn": "ಬೆಳೆ ನಷ್ಟಕ್ಕೆ ಪೂರ್ಣ ವಿಮಾ ಮೊತ್ತ. ಪ್ರೀಮಿಯಂ: ಖರೀಫ್‌ಗೆ 2%, ರಬಿಗೆ 1.5%",
        "eligibility_rules": {
            "min_land_size": 0.1,
        },
        "required_documents": [
            "Aadhaar Card",
            "Land Record (RTC)",
            "Bank Passbook",
            "Sowing Certificate",
        ],
        "prefillable_fields": {
            "full_name": "full_name",
            "mobile": "phone",
            "state": "state",
            "district": "district",
            "land_in_acres": "land_in_acres",
            "crop_type": "primary_crop",
            "bank_account": "bank_account_number",
            "ifsc": "ifsc_code",
        },
        "issuing_authority": "Ministry of Agriculture & Farmers Welfare",
        "scheme_url": "https://pmfby.gov.in",
    },
    {
        "name": "Kisan Credit Card (KCC)",
        "name_kn": "ಕಿಸಾನ್ ಕ್ರೆಡಿಟ್ ಕಾರ್ಡ್",
        "description": (
            "Provides farmers timely access to credit for their agricultural needs at "
            "subsidized interest rates (4-7% per annum). Covers crop cultivation expenses, "
            "post-harvest expenses, maintenance of farm assets."
        ),
        "description_kn": (
            "ರೈತರಿಗೆ ಕೃಷಿ ಅಗತ್ಯಗಳಿಗೆ ಸಬ್ಸಿಡಿ ಬಡ್ಡಿ ದರದಲ್ಲಿ (ವಾರ್ಷಿಕ 4-7%) "
            "ಸಾಲ ನೀಡಲಾಗುತ್ತದೆ."
        ),
        "category": SchemeCategory.loan,
        "benefits": "Flexible credit up to ₹3 lakh at 4% interest. Includes personal accident insurance cover.",
        "benefits_kn": "4% ಬಡ್ಡಿಯಲ್ಲಿ ₹3 ಲಕ್ಷದವರೆಗೆ ಸಾಲ. ವೈಯಕ್ತಿಕ ಅಪಘಾತ ವಿಮೆ ಸಹ ಸೇರಿದೆ.",
        "eligibility_rules": {
            "min_age": 18,
            "max_age": 75,
            "has_bank_account": True,
        },
        "required_documents": [
            "Aadhaar Card",
            "PAN Card",
            "Land Records",
            "Bank Statement (6 months)",
            "Passport-size photograph",
        ],
        "prefillable_fields": {
            "applicant_name": "full_name",
            "age": "age",
            "address": "address",
            "district": "district",
            "state": "state",
            "land_size": "land_size_hectares",
            "primary_crop": "primary_crop",
            "annual_income": "annual_income",
            "phone": "phone",
        },
        "issuing_authority": "NABARD / Commercial Banks / RRBs",
        "max_benefit_amount": 300000.0,
    },
    {
        "name": "PM Kusum Yojana (Solar Pump Subsidy)",
        "name_kn": "ಪ್ರಧಾನ ಮಂತ್ರಿ ಕುಸುಮ್ ಯೋಜನೆ",
        "description": (
            "Provides subsidy for installation of solar-powered irrigation pumps and "
            "solar power plants on agricultural land. Helps reduce electricity costs "
            "and improve water availability."
        ),
        "description_kn": (
            "ಕೃಷಿ ಭೂಮಿಯಲ್ಲಿ ಸೌರ ನೀರಾವರಿ ಪಂಪ್ ಮತ್ತು ಸೌರ ವಿದ್ಯುತ್ ಸ್ಥಾವರ "
            "ಸ್ಥಾಪಿಸಲು ಸಬ್ಸಿಡಿ ನೀಡಲಾಗುತ್ತದೆ."
        ),
        "category": SchemeCategory.subsidy,
        "benefits": "Up to 90% subsidy on solar pump installation (Central + State governments combined)",
        "benefits_kn": "ಸೌರ ಪಂಪ್ ಸ್ಥಾಪನೆಯ ಮೇಲೆ 90% ವರೆಗೆ ಸಬ್ಸಿಡಿ",
        "eligibility_rules": {
            "min_land_size": 0.4,
            "states": ["Karnataka", "Andhra Pradesh", "Telangana", "Maharashtra",
                       "Rajasthan", "Madhya Pradesh", "Uttar Pradesh", "Punjab"],
        },
        "required_documents": [
            "Aadhaar Card",
            "Land Record",
            "Bank Passbook",
            "Electricity Bill (existing connection)",
        ],
        "prefillable_fields": {
            "full_name": "full_name",
            "mobile_number": "phone",
            "state": "state",
            "district": "district",
            "land_in_hectares": "land_size_hectares",
            "village": "village",
            "taluk": "taluk",
            "address": "address",
        },
        "issuing_authority": "Ministry of New and Renewable Energy (MNRE)",
        "scheme_url": "https://pmkusum.mnre.gov.in",
    },
    {
        "name": "Karnataka Raitha Siri Scheme",
        "name_kn": "ಕರ್ನಾಟಕ ರೈತ ಸಿರಿ ಯೋಜನೆ",
        "description": (
            "Karnataka State scheme providing financial assistance to farmers for input costs. "
            "Helps small and marginal farmers in Karnataka with crop-specific incentives."
        ),
        "description_kn": (
            "ಕರ್ನಾಟಕದ ಸಣ್ಣ ಮತ್ತು ಅತಿ ಸಣ್ಣ ರೈತರಿಗೆ ಬೆಳೆ ನಿರ್ದಿಷ್ಟ ಪ್ರೋತ್ಸಾಹ ಧನ ಮತ್ತು "
            "ಕೃಷಿ ಒಳಸುರಿ ವೆಚ್ಚಕ್ಕೆ ಆರ್ಥಿಕ ನೆರವು."
        ),
        "category": SchemeCategory.financial,
        "benefits": "₹2,000–₹5,000 per hectare financial support for agricultural inputs",
        "benefits_kn": "ಕೃಷಿ ಒಳಸುರಿಗಾಗಿ ಪ್ರತಿ ಹೆಕ್ಟೇರಿಗೆ ₹2,000–₹5,000 ಆರ್ಥಿಕ ಬೆಂಬಲ",
        "eligibility_rules": {
            "max_land_size": 2.0,
            "farmer_types": ["small", "marginal"],
            "states": ["Karnataka"],
            "max_annual_income": 200000,
        },
        "required_documents": [
            "Aadhaar Card",
            "RTC (Pahani)",
            "Bank Passbook",
            "Caste Certificate (if applicable)",
        ],
        "prefillable_fields": {
            "name": "full_name",
            "phone": "phone",
            "state": "state",
            "district": "district",
            "taluk": "taluk",
            "village": "village",
            "land_in_hectares": "land_size_hectares",
            "crop_type": "primary_crop",
            "annual_income": "annual_income",
        },
        "issuing_authority": "Department of Agriculture, Government of Karnataka",
        "max_benefit_amount": 10000.0,
    },
]
