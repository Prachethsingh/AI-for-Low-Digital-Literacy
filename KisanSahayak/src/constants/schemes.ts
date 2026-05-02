/**
 * Government Scheme definitions and local filtering logic.
 */

export interface Scheme {
  id: string;
  name_kn: string;
  name_en: string;
  tagline_kn: string;
  tagline_en: string;
  description_kn: string;
  description_en: string;
  icon: string;
  color: string;
  category: string;
  requires_farmer: boolean;
  requires_aadhaar: boolean;
  for_women: boolean;
  apply_url: string;
  helpline: string;
}

export const SCHEMES: Scheme[] = [
  {
    id: "pmkisan",
    name_kn: "ಪಿಎಂ-ಕಿಸಾನ್",
    name_en: "PM-KISAN",
    tagline_kn: "ವರ್ಷಕ್ಕೆ ₹6,000 ನೇರ ಆದಾಯ",
    tagline_en: "₹6,000 per year direct income",
    description_kn: "ಪ್ರತಿ ವರ್ಷ ₹6,000 ನೇರವಾಗಿ ರೈತರ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ₹2,000 ರ 3 ಕಂತುಗಳಲ್ಲಿ ಜಮಾ ಆಗುತ್ತದೆ.",
    description_en: "₹6,000 per year paid directly to farmer's bank account in 3 installments of ₹2,000 each.",
    icon: "💰",
    color: "#2E7D32",
    category: "money",
    requires_farmer: true,
    requires_aadhaar: true,
    for_women: false,
    apply_url: "https://pmkisan.gov.in",
    helpline: "155261",
  },
  {
    id: "pmfby",
    name_kn: "ಪ್ರಧಾನ ಮಂತ್ರಿ ಫಸಲ್ ಬಿಮಾ ಯೋಜನೆ",
    name_en: "PMFBY – Crop Insurance",
    tagline_kn: "ಬೆಳೆ ನಾಶವಾದರೆ ಪರಿಹಾರ",
    tagline_en: "Compensation for crop failure",
    description_kn: "ಪ್ರವಾಹ, ಬರ, ಹವಾಮಾನ ವೈಪರೀತ್ಯದಿಂದ ಬೆಳೆ ನಷ್ಟ ಆದರೆ ವಿಮೆ ಪರಿಹಾರ ಸಿಗುತ್ತದೆ. ಖರೀಫ್ ಬೆಳೆಗಳಿಗೆ 2%, ರಬಿಗೆ 1.5% ಮಾತ್ರ ಪ್ರೀಮಿಯಂ.",
    description_en: "Insurance coverage for crop loss due to flood, drought, or weather. Premium as low as 2% for Kharif and 1.5% for Rabi crops.",
    icon: "🌧️",
    color: "#1565C0",
    category: "farmer",
    requires_farmer: true,
    requires_aadhaar: true,
    for_women: false,
    apply_url: "https://pmfby.gov.in",
    helpline: "14447",
  },
  {
    id: "kcc",
    name_kn: "ಕಿಸಾನ್ ಕ್ರೆಡಿಟ್ ಕಾರ್ಡ್",
    name_en: "Kisan Credit Card (KCC)",
    tagline_kn: "ಕಡಿಮೆ ಬಡ್ಡಿಯ ಸಾಲ",
    tagline_en: "Low-interest farm loan",
    description_kn: "ಬೀಜ, ಗೊಬ್ಬರ, ಉಪಕರಣ ಖರೀದಿಗೆ ಕಡಿಮೆ ಬಡ್ಡಿ ದರದಲ್ಲಿ ಸಾಲ ಪಡೆಯಿರಿ. ಮರುಪಾವತಿ ಅನುಕೂಲಕರ.",
    description_en: "Get low-interest loans for seeds, fertilizers, and equipment. Easy repayment options for all farmers.",
    icon: "💳",
    color: "#6A1B9A",
    category: "money",
    requires_farmer: true,
    requires_aadhaar: true,
    for_women: false,
    apply_url: "https://www.nabard.org/kcc",
    helpline: "1800-180-1551",
  },
  {
    id: "pmksy",
    name_kn: "ಪ್ರಧಾನ ಮಂತ್ರಿ ಕೃಷಿ ಸಿಂಚಾಯಿ ಯೋಜನೆ",
    name_en: "PMKSY – Irrigation Scheme",
    tagline_kn: "ಹನಿ ನೀರಾವರಿ ಸಹಾಯ",
    tagline_en: "Drip & sprinkler irrigation support",
    description_kn: "ಹನಿ ನೀರಾವರಿ ಮತ್ತು ತುಂತುರು ನೀರಾವರಿ ಅಳವಡಿಸಲು ಸರ್ಕಾರ ಸಹಾಯಧನ ನೀಡುತ್ತದೆ. ನೀರು ಉಳಿಸಿ, ಇಳುವರಿ ಹೆಚ್ಚಿಸಿ.",
    description_en: "Government subsidy for drip irrigation and sprinkler systems. Save water and increase crop yield.",
    icon: "💧",
    color: "#00838F",
    category: "farmer",
    requires_farmer: true,
    requires_aadhaar: false,
    for_women: false,
    apply_url: "https://pmksy.gov.in",
    helpline: "1800-180-1551",
  },
  {
    id: "pmkmy",
    name_kn: "ಕಿಸಾನ್ ಮಾನ್ ಧನ್ ಯೋಜನೆ",
    name_en: "PM-KMY – Farmer Pension",
    tagline_kn: "60 ವರ್ಷ ನಂತರ ₹3,000 ತಿಂಗಳ ಪಿಂಚಣಿ",
    tagline_en: "₹3,000/month pension after age 60",
    description_kn: "60 ವರ್ಷ ವಯಸ್ಸಿನ ನಂತರ ತಿಂಗಳಿಗೆ ₹3,000 ಪಿಂಚಣಿ ಸಿಗುತ್ತದೆ. ಕೆಲಸದ ಅವಧಿಯಲ್ಲಿ ಸಣ್ಣ ಮೊತ್ತ ಕೊಡಬೇಕು.",
    description_en: "Pension of ₹3,000 per month after age 60. Small contribution required during working years.",
    icon: "👴",
    color: "#E65100",
    category: "money",
    requires_farmer: true,
    requires_aadhaar: true,
    for_women: false,
    apply_url: "https://maandhan.in",
    helpline: "1800-267-6888",
  },
  {
    id: "enam",
    name_kn: "ಇ-ನಾಮ್ ಆನ್ಲೈನ್ ಮಾರುಕಟ್ಟೆ",
    name_en: "e-NAM Online Market",
    tagline_kn: "ಆನ್ಲೈನ್ನಲ್ಲಿ ಬೆಳೆ ಮಾರಿ, ಉತ್ತಮ ಬೆಲೆ ಪಡೆಯಿರಿ",
    tagline_en: "Sell crops online, get better prices",
    description_kn: "ರಾಷ್ಟ್ರೀಯ ಕೃಷಿ ಮಾರುಕಟ್ಟೆ (ಇ-ನಾಮ್) ಮೂಲಕ ಆನ್ಲೈನ್ನಲ್ಲಿ ಬೆಳೆ ಮಾರಿ. ದಲ್ಲಾಳಿ ಇಲ್ಲದೆ ನೇರ ಖರೀದಿದಾರರಿಗೆ ಮಾರಾಟ.",
    description_en: "Sell crops on National Agriculture Market (e-NAM) directly to buyers across India without middlemen.",
    icon: "📱",
    color: "#558B2F",
    category: "farmer",
    requires_farmer: true,
    requires_aadhaar: true,
    for_women: false,
    apply_url: "https://enam.gov.in",
    helpline: "1800-270-0224",
  },
  {
    id: "pmkusum",
    name_kn: "ಪಿಎಂ-ಕುಸುಮ್ ಸೌರ ಪಂಪ್",
    name_en: "PM-KUSUM Solar Pump",
    tagline_kn: "ಸೌರ ಪಂಪ್ ಅಳವಡಿಕೆ, ವಿದ್ಯುತ್ ಉಳಿತಾಯ",
    tagline_en: "Solar pump installation, save electricity",
    description_kn: "ಸೌರ ನೀರಾವರಿ ಪಂಪ್ ಅಳವಡಿಸಿ ವಿದ್ಯುತ್ ಖರ್ಚು ತಗ್ಗಿಸಿ. ಹೆಚ್ಚುವರಿ ವಿದ್ಯುತ್ ಮಾರಾಟ ಮಾಡಬಹುದು.",
    description_en: "Install solar irrigation pump to cut electricity costs. Extra electricity can be sold back to the grid.",
    icon: "☀️",
    color: "#F57F17",
    category: "farmer",
    requires_farmer: true,
    requires_aadhaar: true,
    for_women: false,
    apply_url: "https://mnre.gov.in/solar/pmkusum",
    helpline: "1800-180-3333",
  },
  {
    id: "soil_health",
    name_kn: "ಮಣ್ಣು ಆರೋಗ್ಯ ಕಾರ್ಡ್",
    name_en: "Soil Health Card Scheme",
    tagline_kn: "ಮಣ್ಣಿನ ಪರೀಕ್ಷೆ, ಸರಿಯಾದ ಗೊಬ್ಬರ",
    tagline_en: "Soil test, right fertilizer advice",
    description_kn: "ನಿಮ್ಮ ಜಮೀನಿನ ಮಣ್ಣಿನ ಪರೀಕ್ಷೆ ಮಾಡಿ ಉಚಿತ ಮಣ್ಣು ಆರೋಗ್ಯ ಕಾರ್ಡ್ ಪಡೆಯಿರಿ. ಸರಿಯಾದ ಗೊಬ್ಬರ ಬಳಸಿ ಇಳುವರಿ ಹೆಚ್ಚಿಸಿ.",
    description_en: "Get a free Soil Health Card after soil testing. Use the right fertilizers to improve crop productivity.",
    icon: "🧪",
    color: "#4E342E",
    category: "farmer",
    requires_farmer: true,
    requires_aadhaar: false,
    for_women: false,
    apply_url: "https://soilhealth.dac.gov.in",
    helpline: "1800-180-1551",
  },
  {
    id: "pmjdy",
    name_kn: "ಪ್ರಧಾನ ಮಂತ್ರಿ ಜನಧನ್ ಯೋಜನೆ",
    name_en: "PM Jan Dhan Yojana",
    tagline_kn: "ಉಚಿತ ಬ್ಯಾಂಕ್ ಖಾತೆ ತೆರೆಯಿರಿ",
    tagline_en: "Open free bank account",
    description_kn: "ಎಲ್ಲರಿಗೂ ಉಚಿತ ಬ್ಯಾಂಕ್ ಖಾತೆ. ₹10,000 ಓವರ್ಡ್ರಾಫ್ಟ್ ಸೌಲಭ್ಯ. ₹2 ಲಕ್ಷ ವಿಮೆ ಕವರ್.",
    description_en: "Free bank account for everyone. ₹10,000 overdraft facility. ₹2 lakh accident insurance cover.",
    icon: "🏦",
    color: "#1A237E",
    category: "money",
    requires_farmer: false,
    requires_aadhaar: true,
    for_women: false,
    apply_url: "https://pmjdy.gov.in",
    helpline: "1800-11-0001",
  },
  {
    id: "pmay",
    name_kn: "ಪ್ರಧಾನ ಮಂತ್ರಿ ಆವಾಸ್ ಯೋಜನೆ",
    name_en: "PM Awas Yojana – Housing",
    tagline_kn: "ಸ್ವಂತ ಮನೆ ನಿರ್ಮಿಸಲು ಸಹಾಯ",
    tagline_en: "Subsidy to build your own home",
    description_kn: "ಬಡ ಮತ್ತು ಮಧ್ಯಮ ವರ್ಗದ ಜನರಿಗೆ ಸ್ವಂತ ಮನೆ ನಿರ್ಮಿಸಲು ಸರ್ಕಾರ ಸಹಾಯಧನ ನೀಡುತ್ತದೆ.",
    description_en: "Government subsidy for poor and middle-income families to build their own house.",
    icon: "🏠",
    color: "#AD1457",
    category: "money",
    requires_farmer: false,
    requires_aadhaar: true,
    for_women: false,
    apply_url: "https://pmaymis.gov.in",
    helpline: "1800-11-3377",
  },
  {
    id: "pmmy",
    name_kn: "ಪ್ರಧಾನ ಮಂತ್ರಿ ಮಾತೃ ವಂದನಾ ಯೋಜನೆ",
    name_en: "PMMVY – Maternity Benefit",
    tagline_kn: "ಗರ್ಭಿಣಿ ಮಹಿಳೆಗೆ ₹5,000 ಸಹಾಯ",
    tagline_en: "₹5,000 maternity support for women",
    description_kn: "ಮೊದಲ ಮಗುವಿಗೆ ಜನ್ಮ ನೀಡಿದ ಗರ್ಭಿಣಿ ಮಹಿಳೆಗೆ ₹5,000 ಸಹಾಯಧನ. ಕೆಲಸ ಕಳೆದುಕೊಂಡ ಆದಾಯ ಭರ್ತಿ.",
    description_en: "₹5,000 maternity benefit for women on first childbirth. Compensation for wage loss during pregnancy.",
    icon: "👶",
    color: "#C62828",
    category: "women",
    requires_farmer: false,
    requires_aadhaar: true,
    for_women: true,
    apply_url: "https://wcd.nic.in/schemes/pradhan-mantri-matru-vandana-yojana",
    helpline: "7998799804",
  },
];

export function getEligibleSchemes(is_farmer: boolean, has_aadhaar: boolean, is_woman: boolean): Scheme[] {
  return SCHEMES.filter(s => {
    if (s.requires_farmer && !is_farmer) return false;
    if (s.requires_aadhaar && !has_aadhaar) return false;
    if (s.for_women && !is_woman) return false;
    return true;
  });
}
