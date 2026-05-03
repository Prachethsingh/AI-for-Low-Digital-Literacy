"""
AI Chatbot Service
==================
Handles farmer queries using:
  1. Rule-based intent detection (fast, no API cost)
  2. Groq LLM fallback (for complex/open queries)
Supports English and Kannada responses.
"""
from typing import Optional, List, Dict
import re
from ..config import settings


# ── Kannada translations for common responses ───────────────────────────────
KN_RESPONSES = {
    "greeting": (
        "ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ಕೃಷಿ ಸಹಾಯಕ. ನಿಮಗೆ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳ ಬಗ್ಗೆ ಸಹಾಯ ಮಾಡಲು ಇಲ್ಲಿದ್ದೇನೆ. "
        "ನೀವು ಏನು ತಿಳಿಯಲು ಬಯಸುತ್ತೀರಿ?"
    ),
    "eligibility": (
        "ನಿಮ್ಮ ಅರ್ಹತೆ ಪರಿಶೀಲಿಸಲು, ದಯವಿಟ್ಟು 'ಅರ್ಹತೆ ತಪಾಸಣೆ' ಬಟನ್ ಕ್ಲಿಕ್ ಮಾಡಿ. "
        "ನಿಮ್ಮ ಭೂಮಿ ಗಾತ್ರ, ಬೆಳೆ ಮತ್ತು ಆದಾಯವನ್ನು ಆಧರಿಸಿ ನಿಮಗೆ ಯಾವ ಯೋಜನೆಗಳು ಸಿಗುತ್ತವೆ ಎಂದು ತೋರಿಸುತ್ತೇನೆ."
    ),
    "schemes": (
        "ಕರ್ನಾಟಕ ಮತ್ತು ಕೇಂದ್ರ ಸರ್ಕಾರದ ಅನೇಕ ಯೋಜನೆಗಳು ರೈತರಿಗೆ ಲಭ್ಯವಿವೆ. "
        "ಪ್ರಮುಖ ಯೋಜನೆಗಳು: PM-KISAN, ರೈತ ಸಮ್ಮಾನ, ಬೆಳೆ ವಿಮೆ ಇತ್ಯಾದಿ."
    ),
    "documents": (
        "ಸಾಮಾನ್ಯವಾಗಿ ಬೇಕಾಗುವ ದಾಖಲೆಗಳು: ಆಧಾರ್ ಕಾರ್ಡ್, ಭೂಮಿ ದಾಖಲೆ (RTC), "
        "ಬ್ಯಾಂಕ್ ಪಾಸ್‌ಬುಕ್, ಪಾಸ್‌ಪೋರ್ಟ್ ಗಾತ್ರದ ಫೋಟೋ."
    ),
    "apply": (
        "ಅರ್ಜಿ ಸಲ್ಲಿಸಲು: 1) ಯೋಜನೆ ಆಯ್ಕೆ ಮಾಡಿ 2) 'ಅರ್ಜಿ ಸಲ್ಲಿಸಿ' ಕ್ಲಿಕ್ ಮಾಡಿ "
        "3) ನಮ್ಮ ವ್ಯವಸ್ಥೆ ಫಾರ್ಮ್ ತುಂಬಿಸುತ್ತದೆ 4) ನೀವು ಪರಿಶೀಲಿಸಿ OTP ನಮೂದಿಸಿ."
    ),
    "fallback": (
        "ಕ್ಷಮಿಸಿ, ನನಗೆ ಅರ್ಥವಾಗಲಿಲ್ಲ. ದಯವಿಟ್ಟು ಇನ್ನೊಮ್ಮೆ ಪ್ರಯತ್ನಿಸಿ ಅಥವಾ ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿ ಕೇಳಿ."
    ),
}

EN_RESPONSES = {
    "greeting": (
        "Hello! I'm your Farmer AI Assistant 🌾 I can help you discover government schemes, "
        "check your eligibility, and assist with application forms. What would you like to know?"
    ),
    "eligibility": (
        "To check your eligibility, click the 'Check Eligibility' button on your dashboard. "
        "I'll match your profile (land size, crops, income, location) against all available schemes "
        "and show you exactly which ones you qualify for."
    ),
    "schemes": (
        "There are several government schemes available for farmers, such as:\n"
        "• **PM-KISAN** — ₹6,000/year income support for small farmers\n"
        "• **Pradhan Mantri Fasal Bima Yojana** — Crop insurance\n"
        "• **Kisan Credit Card** — Subsidized farm credit\n"
        "• **PM Kusum** — Solar pump subsidies\n"
        "Use the 'Check Eligibility' feature to see which ones apply to you!"
    ),
    "documents": (
        "Commonly required documents for government scheme applications:\n"
        "• Aadhaar Card (ID proof)\n"
        "• Land Record / RTC (7/12 extract)\n"
        "• Bank Passbook (first page)\n"
        "• Passport-size photograph\n"
        "• Caste certificate (for reserved category schemes)\n\n"
        "Our system will tell you exactly which documents each scheme needs."
    ),
    "apply": (
        "Here's how to apply through our system:\n"
        "1️⃣ Check your eligibility — see which schemes you qualify for\n"
        "2️⃣ Click **'Apply'** on any scheme\n"
        "3️⃣ We pre-fill the form with your profile data (name, address, land details)\n"
        "4️⃣ **You review** all pre-filled data\n"
        "5️⃣ You handle OTP, CAPTCHA, and final submission yourself\n\n"
        "⚠️ We never touch authentication — your data stays secure!"
    ),
    "pm_kisan": (
        "**PM-KISAN (Pradhan Mantri Kisan Samman Nidhi):**\n"
        "• Benefit: ₹6,000 per year (₹2,000 every 4 months)\n"
        "• Who: Small & marginal farmers with land < 2 hectares\n"
        "• How: Directly credited to your bank account\n"
        "• Required: Aadhaar, Bank Account, Land Records\n\n"
        "Check if you're eligible by clicking 'Check Eligibility'!"
    ),
    "insurance": (
        "**Pradhan Mantri Fasal Bima Yojana (Crop Insurance):**\n"
        "• Covers losses due to natural calamities, pests, diseases\n"
        "• Premium: Only 2% for Kharif, 1.5% for Rabi crops\n"
        "• Benefit: Full sum insured for crop loss\n"
        "• Apply during: Sowing season\n\n"
        "Contact your nearest bank or CSC center to enroll."
    ),
    "deadline": (
        "Each scheme has its own deadline. You can see upcoming deadlines in your "
        "**Notifications** section. I'll alert you when deadlines are approaching!"
    ),
    "fallback": (
        "I'm not sure I understood that. You can ask me things like:\n"
        "• 'Which schemes am I eligible for?'\n"
        "• 'What documents do I need?'\n"
        "• 'How do I apply for PM-KISAN?'\n"
        "• 'What is crop insurance?'\n"
        "Or switch to Kannada — I speak that too! 🌾"
    ),
}

# ── Intent Detection ────────────────────────────────────────────────────────

INTENT_PATTERNS = {
    "greeting": [
        r"\b(hi|hello|hey|namaste|namaskar|vanakkam|sat sri akal)\b",
        r"^(good morning|good evening|good afternoon)$",
    ],
    "eligibility": [
        r"\b(eligible|eligib|qualify|which scheme|what scheme|scheme for me|ಅರ್ಹ)\b",
        r"\b(am i|can i|do i qualify)\b",
    ],
    "schemes": [
        r"\b(scheme|yojana|subsidy|schemes available|government scheme|ಯೋಜನೆ)\b",
        r"\b(list of|show me|what are)\b.*(scheme|yojana)",
    ],
    "documents": [
        r"\b(document|docs|required|papers|certificate|proof|dakhle|ದಾಖಲೆ)\b",
        r"\b(what do i need|what is needed|requirements)\b",
    ],
    "apply": [
        r"\b(apply|application|how to apply|submit|ಅರ್ಜಿ|sallisi)\b",
        r"\b(fill form|fill the form|form filling)\b",
    ],
    "pm_kisan": [
        r"\b(pm.?kisan|kisan samman|6000|6,000|income support)\b",
    ],
    "insurance": [
        r"\b(insurance|fasal bima|crop insurance|bima|ವಿಮೆ)\b",
    ],
    "deadline": [
        r"\b(deadline|last date|expire|expiry|due date|ಕೊನೆ)\b",
    ],
}


def detect_intent(message: str) -> str:
    """Simple regex-based intent detection."""
    msg_lower = message.lower().strip()
    for intent, patterns in INTENT_PATTERNS.items():
        for pattern in patterns:
            if re.search(pattern, msg_lower, re.IGNORECASE):
                return intent
    return "fallback"


def get_suggestions(intent: str, language: str) -> List[str]:
    """Return follow-up question suggestions."""
    en_suggestions = {
        "greeting": [
            "Which schemes am I eligible for?",
            "What documents do I need?",
            "How do I apply?",
        ],
        "eligibility": [
            "How do I apply for PM-KISAN?",
            "What documents are needed?",
            "Tell me about crop insurance",
        ],
        "schemes": [
            "Check my eligibility",
            "Tell me about PM-KISAN",
            "How to apply for a scheme?",
        ],
        "documents": [
            "How do I apply?",
            "Which schemes am I eligible for?",
        ],
        "apply": [
            "What documents do I need?",
            "Which schemes am I eligible for?",
        ],
        "fallback": [
            "Which schemes am I eligible for?",
            "What documents do I need?",
            "How do I apply?",
        ],
    }
    kn_suggestions = {
        "greeting": [
            "ನನಗೆ ಯಾವ ಯೋಜನೆಗಳು ಸಿಗುತ್ತವೆ?",
            "ಯಾವ ದಾಖಲೆಗಳು ಬೇಕು?",
            "ಅರ್ಜಿ ಹೇಗೆ ಸಲ್ಲಿಸಬೇಕು?",
        ],
        "schemes": [
            "PM-KISAN ಬಗ್ಗೆ ಹೇಳಿ",
            "ನನ್ನ ಅರ್ಹತೆ ತಪಾಸಣೆ ಮಾಡಿ",
        ],
        "fallback": [
            "ನನಗೆ ಯಾವ ಯೋಜನೆಗಳು ಸಿಗುತ್ತವೆ?",
            "ಯಾವ ದಾಖಲೆಗಳು ಬೇಕು?",
        ],
    }
    pool = kn_suggestions if language == "kn" else en_suggestions
    return pool.get(intent, pool.get("fallback", []))


async def get_llm_response(message: str, language: str, farmer_context: Optional[Dict] = None) -> str:
    """
    Call Groq LLM for complex queries not handled by rule-based intent.
    Falls back gracefully if API key not set.
    """
    if not settings.GROQ_API_KEY:
        return EN_RESPONSES["fallback"] if language == "en" else KN_RESPONSES["fallback"]

    try:
        from groq import AsyncGroq
        client = AsyncGroq(api_key=settings.GROQ_API_KEY)

        system_prompt = (
            "You are a helpful AI assistant for Indian farmers. "
            "You help farmers understand government schemes, check eligibility, "
            "and apply for agricultural benefits. "
            "Be concise, friendly, and use simple language. "
            f"Respond in {'Kannada' if language == 'kn' else 'English'}. "
        )

        if farmer_context:
            system_prompt += (
                f"\nFarmer context: Name={farmer_context.get('name')}, "
                f"State={farmer_context.get('state')}, "
                f"Land={farmer_context.get('land')} hectares, "
                f"Crop={farmer_context.get('crop')}."
            )

        response = await client.chat.completions.create(
            model=settings.LLM_MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": message},
            ],
            max_tokens=400,
            temperature=0.7,
        )
        return response.choices[0].message.content

    except Exception as e:
        return EN_RESPONSES["fallback"] if language == "en" else KN_RESPONSES["fallback"]


async def process_chat_message(
    message: str,
    language: str = "en",
    farmer_context: Optional[Dict] = None,
) -> Dict:
    """
    Main chatbot entry point.
    Uses rule-based intent first; falls back to LLM for open queries.
    """
    intent = detect_intent(message)

    # Use rule-based response for known intents
    responses = KN_RESPONSES if language == "kn" else EN_RESPONSES
    if intent != "fallback":
        reply = responses.get(intent, responses["fallback"])
    else:
        # Use LLM for open-ended questions
        reply = await get_llm_response(message, language, farmer_context)

    suggestions = get_suggestions(intent, language)

    return {
        "reply": reply,
        "language": language,
        "suggestions": suggestions,
        "intent_detected": intent,
    }
