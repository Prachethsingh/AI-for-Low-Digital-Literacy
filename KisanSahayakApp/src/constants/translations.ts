/**
 * All UI strings in Kannada and English.
 * Keep every string here – no hardcoded text in components.
 */

export type Language = 'kannada' | 'english';

export const T = {
  appName: {
    kannada: 'ಕಿಸಾನ್ ಸಹಾಯಕ',
    english: 'Kisan Sahayak',
  },
  appTagline: {
    kannada: 'ಸರ್ಕಾರಿ ಯೋಜನೆಗಳ ಮಾರ್ಗದರ್ಶಿ',
    english: 'Your Guide to Government Schemes',
  },
  speakQuestion: {
    kannada: 'ಮಾತನಾಡಿ',
    english: 'Speak',
  },
  showDocument: {
    kannada: 'ದಾಖಲೆ ತೋರಿಸಿ',
    english: 'Show Document',
  },
  checkSchemes: {
    kannada: 'ಯೋಜನೆ ಪರಿಶೀಲಿಸಿ',
    english: 'Check Schemes',
  },
  areFarmer: {
    kannada: 'ನೀವು ರೈತರೇ?',
    english: 'Are you a farmer?',
  },
  haveAadhaar: {
    kannada: 'ನಿಮಗೆ ಆಧಾರ್ ಇದೆಯೇ?',
    english: 'Do you have Aadhaar?',
  },
  areWoman: {
    kannada: 'ನೀವು ಮಹಿಳೆಯೇ?',
    english: 'Are you a woman?',
  },
  yes: {
    kannada: 'ಹೌದು',
    english: 'Yes',
  },
  no: {
    kannada: 'ಇಲ್ಲ',
    english: 'No',
  },
  checking: {
    kannada: 'ಪರಿಶೀಲಿಸುತ್ತಿದ್ದೇವೆ…',
    english: 'Checking…',
  },
  eligibleSchemes: {
    kannada: 'ನಿಮಗೆ ಅರ್ಹ ಯೋಜನೆಗಳು',
    english: 'Schemes You Qualify For',
  },
  noSchemes: {
    kannada: 'ಯಾವ ಯೋಜನೆಯೂ ಕಂಡುಬಂದಿಲ್ಲ',
    english: 'No schemes found',
  },
  apply: {
    kannada: 'ಅರ್ಜಿ ಸಲ್ಲಿಸಿ',
    english: 'Apply Now',
  },
  helpline: {
    kannada: 'ಸಹಾಯ ಸಾಲು',
    english: 'Helpline',
  },
  listenExplanation: {
    kannada: 'ವಿವರಣೆ ಕೇಳಿ 🔊',
    english: 'Listen 🔊',
  },
  back: {
    kannada: 'ಹಿಂದೆ',
    english: 'Back',
  },
  home: {
    kannada: 'ಮುಖಪುಟ',
    english: 'Home',
  },
  tryAgain: {
    kannada: 'ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ',
    english: 'Try Again',
  },
  recording: {
    kannada: 'ಕೇಳುತ್ತಿದ್ದೇವೆ… ಮಾತನಾಡಿ',
    english: 'Listening… Speak now',
  },
  processing: {
    kannada: 'ಉತ್ತರ ಹುಡುಕುತ್ತಿದ್ದೇವೆ…',
    english: 'Finding answer…',
  },
  tapMic: {
    kannada: 'ಮೈಕ್ ಒತ್ತಿ ಮಾತನಾಡಿ',
    english: 'Tap mic and speak',
  },
  farmerSchemes: {
    kannada: 'ರೈತ ಯೋಜನೆ',
    english: 'Farmer Schemes',
  },
  moneySchemes: {
    kannada: 'ಹಣ ಯೋಜನೆ',
    english: 'Money Schemes',
  },
  womenSchemes: {
    kannada: 'ಮಹಿಳಾ ಯೋಜನೆ',
    english: 'Women Schemes',
  },
  allSchemes: {
    kannada: 'ಎಲ್ಲ ಯೋಜನೆ',
    english: 'All Schemes',
  },
  languageToggle: {
    kannada: 'English',
    english: 'ಕನ್ನಡ',
  },
};

export function t(key: keyof typeof T, lang: Language): string {
  return T[key][lang] ?? T[key]['english'];
}
