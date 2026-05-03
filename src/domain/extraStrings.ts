import type { Language } from "./i18n";
import { dictionaries } from "./i18n";

// Adds scheme/question/option strings to both languages.
const enExtra: Record<string, string> = {
  q_pm_farmer: "Are you a farmer?",
  q_pm_aadhaar: "Do you have an Aadhaar card?",
  q_pm_aadhaar_scan: "Please show your Aadhaar card",
  q_pm_land_registered: "Is the land registered in your name?",
  q_pm_land_size: "How much land do you own?",
  q_pm_bank: "Do you have a bank account?",
  q_pm_aadhaar_linked: "Is your Aadhaar linked to your bank account?",
  q_pm_received_before: "Have you already received PM-Kisan benefits before?",

  q_b_apply_insurance: "Do you want to apply for crop insurance?",
  q_b_growing: "Are you currently growing crops?",
  q_b_crop: "Which crop are you growing?",
  q_b_land_size: "What is your land size?",
  q_b_damaged: "Is your crop damaged?",
  q_b_damage_cause: "What caused the damage?",
  q_b_crop_damage_scan: "Please show your crop damage",
  q_b_damage_when: "When did the damage happen?",
  q_b_aadhaar: "Please show your Aadhaar card",
  q_b_submit_claim: "Do you want to submit your insurance claim now?",

  opt_small: "Small",
  opt_medium: "Medium",
  opt_large: "Large",
  opt_crop_rice: "Rice",
  opt_crop_wheat: "Wheat",
  opt_crop_maize: "Maize",
  opt_crop_cotton: "Cotton",
  opt_crop_pulses: "Pulses",
  opt_other: "Other",
  opt_flood: "Flood",
  opt_drought: "Drought",
  opt_pest: "Pest",
  opt_today: "Today",
  opt_few_days: "Few days ago",
  opt_week_plus: "More than a week ago"
};

const knExtra: Record<string, string> = {
  q_pm_farmer: "ನೀವು ರೈತರಾ?",
  q_pm_aadhaar: "ನಿಮ್ಮ ಬಳಿ ಆಧಾರ್ ಕಾರ್ಡ್ ಇದೆಯಾ?",
  q_pm_aadhaar_scan: "ದಯವಿಟ್ಟು ನಿಮ್ಮ ಆಧಾರ್ ಕಾರ್ಡ್ ತೋರಿಸಿ",
  q_pm_land_registered: "ಭೂಮಿ ನಿಮ್ಮ ಹೆಸರಿನಲ್ಲಿ ನೋಂದಾಯಿತವಾಗಿದೆಯೇ?",
  q_pm_land_size: "ನಿಮಗೆ ಎಷ್ಟು ಭೂಮಿ ಇದೆ?",
  q_pm_bank: "ನಿಮ್ಮ ಬಳಿ ಬ್ಯಾಂಕ್ ಖಾತೆ ಇದೆಯಾ?",
  q_pm_aadhaar_linked: "ನಿಮ್ಮ ಆಧಾರ್ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ಲಿಂಕ್ ಆಗಿದೆಯಾ?",
  q_pm_received_before: "ನೀವು ಮೊದಲು PM-Kisan ಲಾಭ ಪಡೆದಿದ್ದೀರಾ?",

  q_b_apply_insurance: "ಬೆಳೆ ವಿಮೆಗೆ ಅರ್ಜಿ ಹಾಕಬೇಕೇ?",
  q_b_growing: "ನೀವು ಈಗ ಬೆಳೆ ಬೆಳೆಯುತ್ತಿದ್ದೀರಾ?",
  q_b_crop: "ನೀವು ಯಾವ ಬೆಳೆ ಬೆಳೆಯುತ್ತಿದ್ದೀರಿ?",
  q_b_land_size: "ನಿಮ್ಮ ಭೂಮಿಯ ಗಾತ್ರ ಎಷ್ಟು?",
  q_b_damaged: "ನಿಮ್ಮ ಬೆಳೆ ಹಾನಿಯಾಗಿದೆಯೇ?",
  q_b_damage_cause: "ಹಾನಿಗೆ ಕಾರಣ ಏನು?",
  q_b_crop_damage_scan: "ದಯವಿಟ್ಟು ಬೆಳೆ ಹಾನಿ ತೋರಿಸಿ",
  q_b_damage_when: "ಹಾನಿ ಯಾವಾಗ ಆಯಿತು?",
  q_b_aadhaar: "ದಯವಿಟ್ಟು ನಿಮ್ಮ ಆಧಾರ್ ಕಾರ್ಡ್ ತೋರಿಸಿ",
  q_b_submit_claim: "ವಿಮೆ ಕ್ಲೈಮ್ ಈಗ ಸಲ್ಲಿಸಬೇಕೇ?",

  opt_small: "ಚಿಕ್ಕದು",
  opt_medium: "ಮಧ್ಯಮ",
  opt_large: "ದೊಡ್ಡದು",
  opt_crop_rice: "ಅಕ್ಕಿ",
  opt_crop_wheat: "ಗೋಧಿ",
  opt_crop_maize: "ಮೆಕ್ಕೆಜೋಳ",
  opt_crop_cotton: "ಹತ್ತಿ",
  opt_crop_pulses: "ಕಾಳುಗಳು",
  opt_other: "ಇತರೆ",
  opt_flood: "ಪ್ರಳಯ/ನೆರೆ",
  opt_drought: "ಬರ",
  opt_pest: "ಕೀಟ",
  opt_today: "ಇಂದು",
  opt_few_days: "ಕೆಲವು ದಿನಗಳ ಹಿಂದೆ",
  opt_week_plus: "ಒಂದು ವಾರಕ್ಕಿಂತ ಹೆಚ್ಚು"
};

export function extendDictionaries(): void {
  const langs: Language[] = ["en", "kn"];
  for (const lang of langs) {
    const dict = dictionaries[lang] as Record<string, string>;
    const extra = lang === "kn" ? knExtra : enExtra;
    for (const [k, v] of Object.entries(extra)) dict[k] = v;
  }
}

