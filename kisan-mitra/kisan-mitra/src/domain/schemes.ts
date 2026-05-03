export type Lang = "en" | "kn";

export type QuestionKind =
  | { kind: "yes_no" }
  | { kind: "choice"; options: { id: string; icon: string; en: string; kn: string }[] }
  | { kind: "camera"; purpose: "aadhaar" | "crop" | "land" };

export interface Question {
  id: string;
  en: string;
  kn: string;
  type: QuestionKind;
}

export interface Scheme {
  id: string;
  icon: string;
  color: string;           // primary brand color
  bg: string;              // card background tint
  en: string;              // scheme name
  kn: string;
  tagEn: string;           // one-line tagline
  tagKn: string;
  descEn: string;
  descKn: string;
  benefits: { icon: string; en: string; kn: string }[];
  helpline: string;
  applyUrl: string;
  // Eligibility filter (used before even showing scheme)
  requiresFarmer: boolean;
  requiresAadhaar: boolean;
  forWomen: boolean;
  // Guided questions inside the scheme
  questions: Question[];
}

export const SCHEMES: Scheme[] = [
  // ─── 1. PM-KISAN ─────────────────────────────────────────────────────────
  {
    id: "pm_kisan",
    icon: "💰",
    color: "#2d7a3a",
    bg: "#edfbf1",
    en: "PM-KISAN",
    kn: "ಪಿಎಂ-ಕಿಸಾನ್",
    tagEn: "₹6,000/year directly to farmers",
    tagKn: "ರೈತರಿಗೆ ವರ್ಷಕ್ಕೆ ₹6,000",
    descEn: "Farmers get ₹6,000 every year in 3 installments of ₹2,000 each, directly into their bank account.",
    descKn: "ರೈತರಿಗೆ ಪ್ರತಿ ವರ್ಷ ₹6,000 ನೇರವಾಗಿ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ₹2,000 ರ 3 ಕಂತುಗಳಲ್ಲಿ ಬರುತ್ತದೆ.",
    benefits: [
      { icon: "💵", en: "₹2,000 every 4 months", kn: "4 ತಿಂಗಳಿಗೊಮ್ಮೆ ₹2,000" },
      { icon: "🏦", en: "Direct to bank account", kn: "ನೇರ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ" },
      { icon: "📋", en: "No middlemen", kn: "ದಲ್ಲಾಳಿ ಇಲ್ಲ" },
    ],
    helpline: "155261",
    applyUrl: "https://pmkisan.gov.in",
    requiresFarmer: true,
    requiresAadhaar: true,
    forWomen: false,
    questions: [
      { id: "farmer", en: "Are you a farmer?", kn: "ನೀವು ರೈತರಾ?", type: { kind: "yes_no" } },
      { id: "aadhaar", en: "Do you have Aadhaar?", kn: "ನಿಮ್ಮ ಬಳಿ ಆಧಾರ್ ಇದೆಯಾ?", type: { kind: "yes_no" } },
      { id: "aadhaar_scan", en: "Show your Aadhaar card", kn: "ಆಧಾರ್ ಕಾರ್ಡ್ ತೋರಿಸಿ", type: { kind: "camera", purpose: "aadhaar" } },
      { id: "land_reg", en: "Is land registered in your name?", kn: "ಭೂಮಿ ನಿಮ್ಮ ಹೆಸರಿನಲ್ಲಿ ಇದೆಯಾ?", type: { kind: "yes_no" } },
      {
        id: "land_size", en: "How big is your land?", kn: "ನಿಮ್ಮ ಜಮೀನು ಎಷ್ಟು ದೊಡ್ಡದು?",
        type: { kind: "choice", options: [
          { id: "small",  icon: "🌱", en: "Small (< 1 acre)",    kn: "ಚಿಕ್ಕದು" },
          { id: "medium", icon: "🌾", en: "Medium (1–5 acres)",  kn: "ಮಧ್ಯಮ" },
          { id: "large",  icon: "🌳", en: "Large (> 5 acres)",   kn: "ದೊಡ್ಡದು" },
        ]},
      },
      { id: "bank", en: "Do you have a bank account?", kn: "ನಿಮ್ಮ ಬಳಿ ಬ್ಯಾಂಕ್ ಖಾತೆ ಇದೆಯಾ?", type: { kind: "yes_no" } },
      { id: "aadhaar_bank", en: "Is Aadhaar linked to your bank?", kn: "ಆಧಾರ್ ಬ್ಯಾಂಕ್‌ಗೆ ಲಿಂಕ್ ಆಗಿದೆಯಾ?", type: { kind: "yes_no" } },
    ],
  },

  // ─── 2. PMFBY ────────────────────────────────────────────────────────────
  {
    id: "pmfby",
    icon: "🌧️",
    color: "#1a5f99",
    bg: "#e8f4ff",
    en: "PMFBY – Crop Insurance",
    kn: "ಫಸಲ್ ಬಿಮಾ ಯೋಜನೆ",
    tagEn: "Protect crops from floods & drought",
    tagKn: "ಬೆಳೆ ನಾಶದಿಂದ ರಕ್ಷಣೆ",
    descEn: "If your crops are damaged by floods, drought, or pests — the government compensates you. Very low premium.",
    descKn: "ಪ್ರವಾಹ, ಬರ, ಕೀಟಗಳಿಂದ ಬೆಳೆ ಹಾನಿಯಾದರೆ ಸರ್ಕಾರ ಪರಿಹಾರ ನೀಡುತ್ತದೆ.",
    benefits: [
      { icon: "🌊", en: "Flood damage covered", kn: "ಪ್ರವಾಹ ಹಾನಿ ಕವರ್" },
      { icon: "☀️", en: "Drought coverage", kn: "ಬರ ಕವರ್" },
      { icon: "💸", en: "2% premium only (Kharif)", kn: "ಕೇವಲ 2% ಪ್ರೀಮಿಯಂ" },
    ],
    helpline: "14447",
    applyUrl: "https://pmfby.gov.in",
    requiresFarmer: true,
    requiresAadhaar: true,
    forWomen: false,
    questions: [
      { id: "growing", en: "Are you growing crops now?", kn: "ನೀವು ಈಗ ಬೆಳೆ ಬೆಳೆಯುತ್ತಿದ್ದೀರಾ?", type: { kind: "yes_no" } },
      {
        id: "crop", en: "Which crop?", kn: "ಯಾವ ಬೆಳೆ?",
        type: { kind: "choice", options: [
          { id: "rice",    icon: "🌾", en: "Rice",    kn: "ಅಕ್ಕಿ" },
          { id: "wheat",   icon: "🌿", en: "Wheat",   kn: "ಗೋಧಿ" },
          { id: "maize",   icon: "🌽", en: "Maize",   kn: "ಮೆಕ್ಕೆಜೋಳ" },
          { id: "cotton",  icon: "🧶", en: "Cotton",  kn: "ಹತ್ತಿ" },
          { id: "other",   icon: "🌱", en: "Other",   kn: "ಇತರೆ" },
        ]},
      },
      { id: "damaged", en: "Is your crop damaged?", kn: "ಬೆಳೆ ಹಾನಿ ಆಗಿದೆಯಾ?", type: { kind: "yes_no" } },
      {
        id: "cause", en: "What caused damage?", kn: "ಹಾನಿಗೆ ಕಾರಣ?",
        type: { kind: "choice", options: [
          { id: "flood",   icon: "🌊", en: "Flood",   kn: "ಪ್ರಳಯ" },
          { id: "drought", icon: "☀️", en: "Drought", kn: "ಬರ" },
          { id: "pest",    icon: "🐛", en: "Pest",    kn: "ಕೀಟ" },
          { id: "other",   icon: "💨", en: "Other",   kn: "ಇತರೆ" },
        ]},
      },
      { id: "crop_photo", en: "Show crop damage photo", kn: "ಬೆಳೆ ಹಾನಿ ಫೋಟೋ ತೋರಿಸಿ", type: { kind: "camera", purpose: "crop" } },
      { id: "aadhaar_scan", en: "Show your Aadhaar", kn: "ಆಧಾರ್ ತೋರಿಸಿ", type: { kind: "camera", purpose: "aadhaar" } },
    ],
  },

  // ─── 3. KCC ──────────────────────────────────────────────────────────────
  {
    id: "kcc",
    icon: "💳",
    color: "#6b21a8",
    bg: "#f5f0ff",
    en: "Kisan Credit Card",
    kn: "ಕಿಸಾನ್ ಕ್ರೆಡಿಟ್ ಕಾರ್ಡ್",
    tagEn: "Low-interest loans for farming",
    tagKn: "ಕಡಿಮೆ ಬಡ್ಡಿ ಕೃಷಿ ಸಾಲ",
    descEn: "Get a credit card with low-interest loans to buy seeds, fertilizers, and farming equipment.",
    descKn: "ಬೀಜ, ಗೊಬ್ಬರ ಮತ್ತು ಉಪಕರಣ ಖರೀದಿಗೆ ಕಡಿಮೆ ಬಡ್ಡಿ ದರದಲ್ಲಿ ಸಾಲ ಪಡೆಯಿರಿ.",
    benefits: [
      { icon: "📉", en: "4% interest rate only", kn: "ಕೇವಲ 4% ಬಡ್ಡಿ" },
      { icon: "🌱", en: "Buy seeds & fertilizer", kn: "ಬೀಜ ಗೊಬ್ಬರ ಖರೀದಿ" },
      { icon: "🔄", en: "Easy repayment", kn: "ಸುಲಭ ಮರುಪಾವತಿ" },
    ],
    helpline: "1800-180-1551",
    applyUrl: "https://www.nabard.org/kcc",
    requiresFarmer: true,
    requiresAadhaar: true,
    forWomen: false,
    questions: [
      { id: "farmer", en: "Are you a farmer?", kn: "ನೀವು ರೈತರಾ?", type: { kind: "yes_no" } },
      { id: "bank", en: "Do you have a bank account?", kn: "ಬ್ಯಾಂಕ್ ಖಾತೆ ಇದೆಯಾ?", type: { kind: "yes_no" } },
      { id: "aadhaar_scan", en: "Show Aadhaar card", kn: "ಆಧಾರ್ ತೋರಿಸಿ", type: { kind: "camera", purpose: "aadhaar" } },
      { id: "land_scan", en: "Show land document", kn: "ಭೂಮಿ ದಾಖಲೆ ತೋರಿಸಿ", type: { kind: "camera", purpose: "land" } },
    ],
  },

  // ─── 4. PMKSY ────────────────────────────────────────────────────────────
  {
    id: "pmksy",
    icon: "💧",
    color: "#0e7490",
    bg: "#ecfeff",
    en: "PMKSY – Irrigation",
    kn: "ಸಿಂಚಾಯಿ ಯೋಜನೆ",
    tagEn: "Drip & sprinkler subsidy",
    tagKn: "ಹನಿ ನೀರಾವರಿ ಸಹಾಯ",
    descEn: "Government pays for drip & sprinkler irrigation systems. Save water, grow more crops.",
    descKn: "ಹನಿ ನೀರಾವರಿ ಮತ್ತು ತುಂತುರು ನೀರಾವರಿ ಅಳವಡಿಸಲು ಸರ್ಕಾರ ಸಹಾಯಧನ ನೀಡುತ್ತದೆ.",
    benefits: [
      { icon: "💧", en: "Drip irrigation subsidy", kn: "ಹನಿ ನೀರಾವರಿ ಸಬ್ಸಿಡಿ" },
      { icon: "🌾", en: "More crop per drop", kn: "ಕಡಿಮೆ ನೀರಿನಲ್ಲಿ ಹೆಚ್ಚು ಬೆಳೆ" },
      { icon: "⚡", en: "Lower electricity bill", kn: "ವಿದ್ಯುತ್ ಉಳಿತಾಯ" },
    ],
    helpline: "1800-180-1551",
    applyUrl: "https://pmksy.gov.in",
    requiresFarmer: true,
    requiresAadhaar: false,
    forWomen: false,
    questions: [
      { id: "farmer", en: "Are you a farmer?", kn: "ನೀವು ರೈತರಾ?", type: { kind: "yes_no" } },
      { id: "irrigation", en: "Do you need irrigation help?", kn: "ನೀರಾವರಿ ಸಹಾಯ ಬೇಕೇ?", type: { kind: "yes_no" } },
      { id: "land_scan", en: "Show land document", kn: "ಭೂಮಿ ದಾಖಲೆ ತೋರಿಸಿ", type: { kind: "camera", purpose: "land" } },
    ],
  },

  // ─── 5. PM-KMY (Pension) ─────────────────────────────────────────────────
  {
    id: "pmkmy",
    icon: "👴",
    color: "#b45309",
    bg: "#fffbeb",
    en: "Kisan Pension (PM-KMY)",
    kn: "ಕಿಸಾನ್ ಪಿಂಚಣಿ",
    tagEn: "₹3,000/month after age 60",
    tagKn: "60 ವರ್ಷ ನಂತರ ₹3,000 ತಿಂಗಳು",
    descEn: "Farmers get a monthly pension of ₹3,000 after the age of 60. Contribute a small amount now.",
    descKn: "60 ವರ್ಷ ನಂತರ ತಿಂಗಳಿಗೆ ₹3,000 ಪಿಂಚಣಿ ಸಿಗುತ್ತದೆ. ಈಗ ಸಣ್ಣ ಮೊತ್ತ ಕೊಡಿ.",
    benefits: [
      { icon: "👴", en: "₹3,000/month pension", kn: "₹3,000 ತಿಂಗಳ ಪಿಂಚಣಿ" },
      { icon: "🛡️", en: "Lifelong security", kn: "ಜೀವನ ಭದ್ರತೆ" },
      { icon: "🤝", en: "Govt matches your savings", kn: "ಸರ್ಕಾರ ಹಣ ತುಂಬುತ್ತದೆ" },
    ],
    helpline: "1800-267-6888",
    applyUrl: "https://maandhan.in",
    requiresFarmer: true,
    requiresAadhaar: true,
    forWomen: false,
    questions: [
      { id: "age", en: "Are you between 18–40 years old?", kn: "ನಿಮ್ಮ ವಯಸ್ಸು 18–40 ನಡುವೆ ಇದೆಯಾ?", type: { kind: "yes_no" } },
      { id: "farmer", en: "Are you a small farmer?", kn: "ನೀವು ಸಣ್ಣ ರೈತರಾ?", type: { kind: "yes_no" } },
      { id: "aadhaar_scan", en: "Show Aadhaar", kn: "ಆಧಾರ್ ತೋರಿಸಿ", type: { kind: "camera", purpose: "aadhaar" } },
    ],
  },

  // ─── 6. e-NAM ────────────────────────────────────────────────────────────
  {
    id: "enam",
    icon: "📱",
    color: "#4d7c0f",
    bg: "#f7fee7",
    en: "e-NAM Online Market",
    kn: "ಇ-ನಾಮ್ ಮಾರುಕಟ್ಟೆ",
    tagEn: "Sell crops online, better prices",
    tagKn: "ಆನ್‌ಲೈನ್‌ನಲ್ಲಿ ಬೆಳೆ ಮಾರಿ",
    descEn: "Sell your crops directly to buyers across India online — no middlemen, better price.",
    descKn: "ದಲ್ಲಾಳಿ ಇಲ್ಲದೆ ನೇರ ಖರೀದಿದಾರರಿಗೆ ಆನ್‌ಲೈನ್‌ನಲ್ಲಿ ಬೆಳೆ ಮಾರಿ.",
    benefits: [
      { icon: "💹", en: "Better market price", kn: "ಉತ್ತಮ ಮಾರುಕಟ್ಟೆ ಬೆಲೆ" },
      { icon: "🚫", en: "No middlemen", kn: "ದಲ್ಲಾಳಿ ಇಲ್ಲ" },
      { icon: "🌍", en: "Buyers from all India", kn: "ಭಾರತ ಎಲ್ಲ ಕಡೆ ಖರೀದಿದಾರರು" },
    ],
    helpline: "1800-270-0224",
    applyUrl: "https://enam.gov.in",
    requiresFarmer: true,
    requiresAadhaar: true,
    forWomen: false,
    questions: [
      { id: "farmer", en: "Are you a farmer?", kn: "ನೀವು ರೈತರಾ?", type: { kind: "yes_no" } },
      { id: "smartphone", en: "Do you have a smartphone?", kn: "ನಿಮ್ಮ ಬಳಿ ಸ್ಮಾರ್ಟ್‌ಫೋನ್ ಇದೆಯಾ?", type: { kind: "yes_no" } },
      { id: "aadhaar_scan", en: "Show Aadhaar", kn: "ಆಧಾರ್ ತೋರಿಸಿ", type: { kind: "camera", purpose: "aadhaar" } },
    ],
  },

  // ─── 7. PM-KUSUM ─────────────────────────────────────────────────────────
  {
    id: "pmkusum",
    icon: "☀️",
    color: "#d97706",
    bg: "#fffbeb",
    en: "PM-KUSUM Solar Pump",
    kn: "ಸೌರ ಪಂಪ್ ಯೋಜನೆ",
    tagEn: "Solar pump, save electricity",
    tagKn: "ಸೌರ ಪಂಪ್, ವಿದ್ಯುತ್ ಉಳಿತಾಯ",
    descEn: "Install a solar water pump for irrigation. Save on electricity and earn from extra power.",
    descKn: "ಸೌರ ನೀರಾವರಿ ಪಂಪ್ ಅಳವಡಿಸಿ ವಿದ್ಯುತ್ ಖರ್ಚು ತಗ್ಗಿಸಿ.",
    benefits: [
      { icon: "☀️", en: "Solar pump installed", kn: "ಸೌರ ಪಂಪ್ ಅಳವಡಿಕೆ" },
      { icon: "⚡", en: "Zero electricity cost", kn: "ವಿದ್ಯುತ್ ಖರ್ಚು ಶೂನ್ಯ" },
      { icon: "💰", en: "Sell extra power", kn: "ಹೆಚ್ಚು ವಿದ್ಯುತ್ ಮಾರಾಟ" },
    ],
    helpline: "1800-180-3333",
    applyUrl: "https://mnre.gov.in/solar/pmkusum",
    requiresFarmer: true,
    requiresAadhaar: true,
    forWomen: false,
    questions: [
      { id: "farmer", en: "Do you farm with irrigation?", kn: "ನೀರಾವರಿ ಕೃಷಿ ಮಾಡುತ್ತೀರಾ?", type: { kind: "yes_no" } },
      { id: "elec_bill", en: "Is your electricity bill high?", kn: "ವಿದ್ಯುತ್ ಬಿಲ್ ಹೆಚ್ಚಾಗಿದೆಯಾ?", type: { kind: "yes_no" } },
      { id: "aadhaar_scan", en: "Show Aadhaar", kn: "ಆಧಾರ್ ತೋರಿಸಿ", type: { kind: "camera", purpose: "aadhaar" } },
    ],
  },

  // ─── 8. Soil Health Card ────────────────────────────────────────────────
  {
    id: "soil_health",
    icon: "🧪",
    color: "#78350f",
    bg: "#fdf8f0",
    en: "Soil Health Card",
    kn: "ಮಣ್ಣು ಆರೋಗ್ಯ ಕಾರ್ಡ್",
    tagEn: "Free soil test, right fertilizer",
    tagKn: "ಉಚಿತ ಮಣ್ಣು ಪರೀಕ್ಷೆ",
    descEn: "Get a free soil health card that tells you exactly which fertilizers to use. Grow more.",
    descKn: "ಉಚಿತ ಮಣ್ಣು ಆರೋಗ್ಯ ಕಾರ್ಡ್ ಪಡೆಯಿರಿ. ಯಾವ ಗೊಬ್ಬರ ಹಾಕಬೇಕೆಂದು ತಿಳಿಯಿರಿ.",
    benefits: [
      { icon: "🧪", en: "Free soil test", kn: "ಉಚಿತ ಮಣ್ಣು ಪರೀಕ್ಷೆ" },
      { icon: "📋", en: "Fertilizer advice", kn: "ಗೊಬ್ಬರ ಸಲಹೆ" },
      { icon: "🌾", en: "More yield", kn: "ಹೆಚ್ಚು ಇಳುವರಿ" },
    ],
    helpline: "1800-180-1551",
    applyUrl: "https://soilhealth.dac.gov.in",
    requiresFarmer: true,
    requiresAadhaar: false,
    forWomen: false,
    questions: [
      { id: "farmer", en: "Are you a farmer?", kn: "ನೀವು ರೈತರಾ?", type: { kind: "yes_no" } },
      { id: "soil_test", en: "Have you done soil testing before?", kn: "ಮಣ್ಣು ಪರೀಕ್ಷೆ ಮಾಡಿದ್ದೀರಾ?", type: { kind: "yes_no" } },
      { id: "land_scan", en: "Show land document (optional)", kn: "ಭೂಮಿ ದಾಖಲೆ ತೋರಿಸಿ (ಐಚ್ಛಿಕ)", type: { kind: "camera", purpose: "land" } },
    ],
  },

  // ─── 9. PM Jan Dhan ─────────────────────────────────────────────────────
  {
    id: "pmjdy",
    icon: "🏦",
    color: "#1e3a8a",
    bg: "#eff6ff",
    en: "PM Jan Dhan Yojana",
    kn: "ಜನಧನ್ ಯೋಜನೆ",
    tagEn: "Free bank account for everyone",
    tagKn: "ಎಲ್ಲರಿಗೂ ಉಚಿತ ಬ್ಯಾಂಕ್ ಖಾತೆ",
    descEn: "Open a free zero-balance bank account. Get ₹2 lakh accident insurance. ₹10,000 overdraft.",
    descKn: "ಉಚಿತ ಬ್ಯಾಂಕ್ ಖಾತೆ ತೆರೆಯಿರಿ. ₹2 ಲಕ್ಷ ವಿಮೆ ಮತ್ತು ₹10,000 ಓವರ್‌ಡ್ರಾಫ್ಟ್.",
    benefits: [
      { icon: "🏦", en: "Zero-balance account", kn: "ಮಿನಿಮಮ್ ಬ್ಯಾಲೆನ್ಸ್ ಇಲ್ಲ" },
      { icon: "🛡️", en: "₹2 lakh insurance", kn: "₹2 ಲಕ್ಷ ವಿಮೆ" },
      { icon: "💳", en: "Free RuPay card", kn: "ಉಚಿತ ರುಪೇ ಕಾರ್ಡ್" },
    ],
    helpline: "1800-11-0001",
    applyUrl: "https://pmjdy.gov.in",
    requiresFarmer: false,
    requiresAadhaar: true,
    forWomen: false,
    questions: [
      { id: "no_account", en: "Do you NOT have a bank account?", kn: "ನಿಮ್ಮ ಬಳಿ ಬ್ಯಾಂಕ್ ಖಾತೆ ಇಲ್ಲವಾ?", type: { kind: "yes_no" } },
      { id: "aadhaar_scan", en: "Show Aadhaar", kn: "ಆಧಾರ್ ತೋರಿಸಿ", type: { kind: "camera", purpose: "aadhaar" } },
    ],
  },

  // ─── 10. PM Awas ────────────────────────────────────────────────────────
  {
    id: "pmay",
    icon: "🏠",
    color: "#9f1239",
    bg: "#fff1f2",
    en: "PM Awas – Housing",
    kn: "ಪ್ರಧಾನ ಮಂತ್ರಿ ಆವಾಸ್",
    tagEn: "Subsidy to build your own home",
    tagKn: "ಸ್ವಂತ ಮನೆ ಕಟ್ಟಲು ಸಹಾಯ",
    descEn: "Government gives subsidy to build or improve your home. For poor and middle-income families.",
    descKn: "ಬಡ ಮತ್ತು ಮಧ್ಯಮ ವರ್ಗದ ಜನರಿಗೆ ಸ್ವಂತ ಮನೆ ಕಟ್ಟಲು ಸರ್ಕಾರ ಸಹಾಯ ನೀಡುತ್ತದೆ.",
    benefits: [
      { icon: "🏠", en: "Subsidized housing loan", kn: "ಸಬ್ಸಿಡಿ ಮನೆ ಸಾಲ" },
      { icon: "💵", en: "Up to ₹2.5 lakh benefit", kn: "₹2.5 ಲಕ್ಷ ಸಹಾಯ" },
      { icon: "👨‍👩‍👧", en: "For poor families", kn: "ಬಡ ಕುಟುಂಬಗಳಿಗೆ" },
    ],
    helpline: "1800-11-3377",
    applyUrl: "https://pmaymis.gov.in",
    requiresFarmer: false,
    requiresAadhaar: true,
    forWomen: false,
    questions: [
      { id: "no_home", en: "Do you not have a pucca house?", kn: "ನಿಮ್ಮ ಬಳಿ ಪಕ್ಕಾ ಮನೆ ಇಲ್ಲವಾ?", type: { kind: "yes_no" } },
      { id: "aadhaar_scan", en: "Show Aadhaar", kn: "ಆಧಾರ್ ತೋರಿಸಿ", type: { kind: "camera", purpose: "aadhaar" } },
    ],
  },

  // ─── 11. PMMVY (Women) ──────────────────────────────────────────────────
  {
    id: "pmmvy",
    icon: "👶",
    color: "#be185d",
    bg: "#fdf2f8",
    en: "PMMVY – Maternity Benefit",
    kn: "ಮಾತೃ ವಂದನಾ ಯೋಜನೆ",
    tagEn: "₹5,000 support for pregnant women",
    tagKn: "ಗರ್ಭಿಣಿ ಮಹಿಳೆಗೆ ₹5,000",
    descEn: "Pregnant women get ₹5,000 for their first child. Compensation for lost wages during pregnancy.",
    descKn: "ಮೊದಲ ಮಗುವಿಗೆ ಗರ್ಭಿಣಿ ಮಹಿಳೆ ₹5,000 ಪಡೆಯಬಹುದು.",
    benefits: [
      { icon: "💰", en: "₹5,000 cash benefit", kn: "₹5,000 ನಗದು" },
      { icon: "👶", en: "First child benefit", kn: "ಮೊದಲ ಮಗುವಿಗೆ" },
      { icon: "🍎", en: "Better nutrition support", kn: "ಪೋಷಣೆ ಸಹಾಯ" },
    ],
    helpline: "7998799804",
    applyUrl: "https://wcd.nic.in",
    requiresFarmer: false,
    requiresAadhaar: true,
    forWomen: true,
    questions: [
      { id: "pregnant", en: "Are you pregnant with first child?", kn: "ನೀವು ಮೊದಲ ಮಗುವಿಗೆ ಗರ್ಭಿಣಿಯಾ?", type: { kind: "yes_no" } },
      { id: "aadhaar_scan", en: "Show Aadhaar", kn: "ಆಧಾರ್ ತೋರಿಸಿ", type: { kind: "camera", purpose: "aadhaar" } },
    ],
  },
];

// ─── Eligibility engine ───────────────────────────────────────────────────

export type UserProfile = {
  isFarmer: boolean;
  hasAadhaar: boolean;
  isWoman: boolean;
};

export function getEligibleSchemes(profile: UserProfile): Scheme[] {
  return SCHEMES.filter((s) => {
    if (s.requiresFarmer && !profile.isFarmer) return false;
    if (s.requiresAadhaar && !profile.hasAadhaar) return false;
    if (s.forWomen && !profile.isWoman) return false;
    return true;
  });
}
