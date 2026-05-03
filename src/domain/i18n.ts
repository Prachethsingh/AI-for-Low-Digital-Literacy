export type Language = "en" | "kn";

type Dict = Record<string, string>;

const en: Dict = {
  app_name: "AI Sahayak",
  choose_language: "Choose language",
  english: "English",
  kannada: "Kannada",
  continue: "Continue",
  back: "Back",
  namaste: "Namaste! 👋",
  how_can_help: "How can I help you?",
  tap_to_speak: "Tap to speak",
  choose_scheme: "Choose a Scheme",
  scheme_hint: "Which scheme do you need help with?",
  scheme_pm_kisan: "PM Kisan Samman Nidhi",
  scheme_pm_kisan_desc: "Financial support for farmers",
  scheme_bima: "Kisan Fasal Bima Yojana",
  scheme_bima_desc: "Crop insurance for farmers",
  listen: "Listen",
  next: "Next",
  skip: "Skip",
  yes: "Yes",
  no: "No",
  ok: "OK",
  camera_open: "Open camera",
  capture: "Capture",
  camera_permission_needed: "Camera permission needed to scan.",
  summary_title: "Here is your information",
  confirm: "Please confirm",
  all_correct: "All correct",
  edit_if_needed: "Edit if needed",
  ready_title: "Your application is ready!",
  ready_subtitle: "You can download it or submit it now.",
  download_pdf: "Download PDF",
  submit: "Submit Application",
  download_submit: "Both (Download & Submit)",
  go_home: "Go to Home",
  voice_not_supported:
    "Voice input uses your browser. If you don’t see a mic prompt, use the big buttons to answer."
};

const kn: Dict = {
  app_name: "AI ಸಹಾಯಕ",
  choose_language: "ಭಾಷೆ ಆಯ್ಕೆಮಾಡಿ",
  english: "ಇಂಗ್ಲಿಷ್",
  kannada: "ಕನ್ನಡ",
  continue: "ಮುಂದುವರಿಸಿ",
  back: "ಹಿಂದೆ",
  namaste: "ನಮಸ್ಕಾರ! 👋",
  how_can_help: "ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಲಿ?",
  tap_to_speak: "ಮಾತಾಡಲು ಒತ್ತಿ",
  choose_scheme: "ಯೋಜನೆ ಆಯ್ಕೆಮಾಡಿ",
  scheme_hint: "ನಿಮಗೆ ಯಾವ ಯೋಜನೆ ಬಗ್ಗೆ ಸಹಾಯ ಬೇಕು?",
  scheme_pm_kisan: "ಪಿ.ಎಂ. ಕಿಸಾನ್ ಸಮಾನ ನಿಧಿ",
  scheme_pm_kisan_desc: "ರೈತರಿಗೆ ಹಣಕಾಸು ಸಹಾಯ",
  scheme_bima: "ಕಿಸಾನ್ ಫಸಲ್ ಬಿಮಾ ಯೋಜನೆ",
  scheme_bima_desc: "ಬೆಳೆ ವಿಮೆ ಸಹಾಯ",
  listen: "ಕೇಳಿಸಿ",
  next: "ಮುಂದೆ",
  skip: "ಬಿಡಿ",
  yes: "ಹೌದು",
  no: "ಇಲ್ಲ",
  ok: "ಸರಿ",
  camera_open: "ಕ್ಯಾಮೆರಾ ತೆರೆಯಿರಿ",
  capture: "ಸೆರೆಹಿಡಿ",
  camera_permission_needed: "ಸ್ಕ್ಯಾನ್ ಮಾಡಲು ಕ್ಯಾಮೆರಾ ಅನುಮತಿ ಬೇಕು.",
  summary_title: "ನಿಮ್ಮ ಮಾಹಿತಿ",
  confirm: "ದಯವಿಟ್ಟು ದೃಢಪಡಿಸಿ",
  all_correct: "ಎಲ್ಲವೂ ಸರಿಯಿದೆ",
  edit_if_needed: "ಬೇಕಾದರೆ ತಿದ್ದು",
  ready_title: "ನಿಮ್ಮ ಅರ್ಜಿ ಸಿದ್ಧವಾಗಿದೆ!",
  ready_subtitle: "ಡೌನ್‌ಲೋಡ್ ಅಥವಾ ಸಲ್ಲಿಸಬಹುದು.",
  download_pdf: "PDF ಡೌನ್‌ಲೋಡ್",
  submit: "ಅರ್ಜಿಯನ್ನು ಸಲ್ಲಿಸಿ",
  download_submit: "ಎರಡೂ (ಡೌನ್‌ಲೋಡ್ + ಸಲ್ಲಿಸಿ)",
  go_home: "ಮುಖಪುಟಕ್ಕೆ",
  voice_not_supported:
    "ವಾಯ್ಸ್ ಇನ್‌ಪುಟ್ ನಿಮ್ಮ ಬ್ರೌಸರ್‌ ಮೇಲೆ ಅವಲಂಬಿತವಾಗಿದೆ. ಮೈಕ್ ಕೇಳದೇ ಇದ್ದರೆ ಬಟನ್‌ಗಳಿಂದ ಉತ್ತರಿಸಿ."
};

export const dictionaries: Record<Language, Dict> = { en, kn };

export function t(lang: Language, key: keyof typeof en): string {
  const dict = dictionaries[lang] ?? en;
  return dict[key] ?? en[key] ?? key;
}

