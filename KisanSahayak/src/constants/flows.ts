export type OptionType = 'yesno' | 'multiple' | 'camera';

export interface Option {
  id: string;
  labelEn: string;
  labelKn: string;
  icon?: string;
}

export interface Question {
  id: string;
  textEn: string;
  textKn: string;
  type: OptionType;
  options?: Option[];
  cameraPromptEn?: string;
  cameraPromptKn?: string;
}

export interface Flow {
  id: string;
  titleEn: string;
  titleKn: string;
  icon: string;
  questions: Question[];
}

export const YES_NO_OPTIONS: Option[] = [
  { id: 'yes', labelEn: 'Yes', labelKn: 'ಹೌದು', icon: '👍' },
  { id: 'no', labelEn: 'No', labelKn: 'ಇಲ್ಲ', icon: '👎' },
];

export const FLOWS: Record<string, Flow> = {
  pm_kisan: {
    id: 'pm_kisan',
    titleEn: 'PM Kisan Samman Nidhi',
    titleKn: 'ಪಿಎಂ ಕಿಸಾನ್ ಸಮ್ಮಾನ್ ನಿಧಿ',
    icon: '🌾',
    questions: [
      {
        id: 'q1',
        textEn: 'Are you a farmer?',
        textKn: 'ನೀವು ರೈತರೇ?',
        type: 'yesno',
        options: YES_NO_OPTIONS,
      },
      {
        id: 'q2',
        textEn: 'Do you have Aadhaar card?',
        textKn: 'ನಿಮ್ಮ ಬಳಿ ಆಧಾರ್ ಕಾರ್ಡ್ ಇದೆಯೇ?',
        type: 'yesno',
        options: YES_NO_OPTIONS,
      },
      {
        id: 'q2_cam',
        textEn: 'Show your Aadhaar card',
        textKn: 'ನಿಮ್ಮ ಆಧಾರ್ ಕಾರ್ಡ್ ತೋರಿಸಿ',
        type: 'camera',
        cameraPromptEn: 'Please show your Aadhaar card',
        cameraPromptKn: 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ಆಧಾರ್ ಕಾರ್ಡ್ ತೋರಿಸಿ',
      },
      {
        id: 'q3',
        textEn: 'Is land registered in your name?',
        textKn: 'ಭೂಮಿ ನಿಮ್ಮ ಹೆಸರಿನಲ್ಲಿ ನೋಂದಣಿಯಾಗಿದೆಯೇ?',
        type: 'yesno',
        options: YES_NO_OPTIONS,
      },
      {
        id: 'q4',
        textEn: 'How much land do you own?',
        textKn: 'ನೀವು ಎಷ್ಟು ಭೂಮಿ ಹೊಂದಿದ್ದೀರಿ?',
        type: 'multiple',
        options: [
          { id: 'small', labelEn: 'Small\n(Up to 1 acre)', labelKn: 'ಸಣ್ಣ (1 ಎಕರೆವರೆಗೆ)', icon: '🌿' },
          { id: 'medium', labelEn: 'Medium\n(1-5 acres)', labelKn: 'ಮಧ್ಯಮ (1-5 ಎಕರೆ)', icon: '🌾' },
          { id: 'large', labelEn: 'Large\n(Above 5 acres)', labelKn: 'ದೊಡ್ಡ (5 ಎಕರೆಗಿಂತ ಹೆಚ್ಚು)', icon: '🌳' },
        ],
      },
      {
        id: 'q5',
        textEn: 'Do you have a bank account?',
        textKn: 'ನಿಮಗೆ ಬ್ಯಾಂಕ್ ಖಾತೆ ಇದೆಯೇ?',
        type: 'yesno',
        options: YES_NO_OPTIONS,
      },
      {
        id: 'q6',
        textEn: 'Is Aadhaar linked to your bank account?',
        textKn: 'ನಿಮ್ಮ ಆಧಾರ್ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ಲಿಂಕ್ ಆಗಿದೆಯೇ?',
        type: 'yesno',
        options: YES_NO_OPTIONS,
      },
      {
        id: 'q7',
        textEn: 'Already received PM-Kisan benefits?',
        textKn: 'ಈಗಾಗಲೇ ಪಿಎಂ-ಕಿಸಾನ್ ಲಾಭ ಪಡೆದಿದ್ದೀರಾ?',
        type: 'yesno',
        options: YES_NO_OPTIONS,
      },
      {
        id: 'q8',
        textEn: 'Download or Submit?',
        textKn: 'ಡೌನ್‌ಲೋಡ್ ಅಥವಾ ಸಲ್ಲಿಸಿ?',
        type: 'multiple',
        options: [
          { id: 'download', labelEn: 'Download PDF', labelKn: 'ಪಿಡಿಎಫ್ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ' },
          { id: 'submit', labelEn: 'Submit Application', labelKn: 'ಅರ್ಜಿ ಸಲ್ಲಿಸಿ' },
          { id: 'both', labelEn: 'Both (Download & Submit)', labelKn: 'ಎರಡೂ (ಡೌನ್‌ಲೋಡ್ ಮತ್ತು ಸಲ್ಲಿಸಿ)' },
        ],
      },
    ],
  },
  pmfby: {
    id: 'pmfby',
    titleEn: 'Crop Insurance (PMFBY)',
    titleKn: 'ಬೆಳೆ ವಿಮೆ (ಪಿಎಂಎಫ್‌ಬಿವೈ)',
    icon: '🛡️',
    questions: [
      {
        id: 'q1',
        textEn: 'Apply for crop insurance?',
        textKn: 'ಬೆಳೆ ವಿಮೆಗೆ ಅರ್ಜಿ ಸಲ್ಲಿಸುವಿರಾ?',
        type: 'yesno',
        options: YES_NO_OPTIONS,
      },
      {
        id: 'q2',
        textEn: 'Are you currently growing crops?',
        textKn: 'ನೀವು ಪ್ರಸ್ತುತ ಬೆಳೆಗಳನ್ನು ಬೆಳೆಯುತ್ತಿದ್ದೀರಾ?',
        type: 'yesno',
        options: YES_NO_OPTIONS,
      },
      {
        id: 'q3',
        textEn: 'Which crop are you growing?',
        textKn: 'ನೀವು ಯಾವ ಬೆಳೆ ಬೆಳೆಯುತ್ತಿದ್ದೀರಿ?',
        type: 'multiple',
        options: [
          { id: 'rice', labelEn: 'Rice', labelKn: 'ಭತ್ತ', icon: '🌾' },
          { id: 'wheat', labelEn: 'Wheat', labelKn: 'ಗೋಧಿ', icon: '🌾' },
          { id: 'maize', labelEn: 'Maize', labelKn: 'ಮೆಕ್ಕೆಜೋಳ', icon: '🌽' },
          { id: 'cotton', labelEn: 'Cotton', labelKn: 'ಹತ್ತಿ', icon: '☁️' },
          { id: 'pulses', labelEn: 'Pulses', labelKn: 'ಬೇಳೆಕಾಳುಗಳು', icon: '🌱' },
          { id: 'other', labelEn: 'Other', labelKn: 'ಇತರೆ', icon: '⚪' },
        ],
      },
      {
        id: 'q4',
        textEn: 'What is your land size?',
        textKn: 'ನಿಮ್ಮ ಭೂಮಿಯ ಗಾತ್ರ ಎಷ್ಟು?',
        type: 'multiple',
        options: [
          { id: 'small', labelEn: 'Small\n(Up to 1 acre)', labelKn: 'ಸಣ್ಣ (1 ಎಕರೆವರೆಗೆ)', icon: '🌿' },
          { id: 'medium', labelEn: 'Medium\n(1-5 acres)', labelKn: 'ಮಧ್ಯಮ (1-5 ಎಕರೆ)', icon: '🌾' },
          { id: 'large', labelEn: 'Large\n(Above 5 acres)', labelKn: 'ದೊಡ್ಡ (5 ಎಕರೆಗಿಂತ ಹೆಚ್ಚು)', icon: '🌳' },
        ],
      },
      {
        id: 'q5',
        textEn: 'Is your crop damaged?',
        textKn: 'ನಿಮ್ಮ ಬೆಳೆ ಹಾನಿಯಾಗಿದೆಯೇ?',
        type: 'yesno',
        options: YES_NO_OPTIONS,
      },
      {
        id: 'q6',
        textEn: 'What caused the damage?',
        textKn: 'ಹಾನಿಗೆ ಕಾರಣವೇನು?',
        type: 'multiple',
        options: [
          { id: 'flood', labelEn: 'Flood', labelKn: 'ಪ್ರವಾಹ', icon: '🌊' },
          { id: 'drought', labelEn: 'Drought', labelKn: 'ಬರ', icon: '☀️' },
          { id: 'pest', labelEn: 'Pest', labelKn: 'ಕೀಟ', icon: '🐛' },
          { id: 'other', labelEn: 'Other', labelKn: 'ಇತರೆ', icon: '⚪' },
        ],
      },
      {
        id: 'q7',
        textEn: 'Show your crop damage',
        textKn: 'ನಿಮ್ಮ ಬೆಳೆ ಹಾನಿಯನ್ನು ತೋರಿಸಿ',
        type: 'camera',
        cameraPromptEn: 'Please show your crop damage',
        cameraPromptKn: 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ಬೆಳೆ ಹಾನಿಯನ್ನು ತೋರಿಸಿ',
      },
      {
        id: 'q8',
        textEn: 'When did the damage happen?',
        textKn: 'ಹಾನಿ ಯಾವಾಗ ಸಂಭವಿಸಿದೆ?',
        type: 'multiple',
        options: [
          { id: 'today', labelEn: 'Today', labelKn: 'ಇಂದು', icon: '📅' },
          { id: 'few_days', labelEn: 'Few days ago', labelKn: 'ಕೆಲವು ದಿನಗಳ ಹಿಂದೆ', icon: '⏳' },
          { id: 'more_than_week', labelEn: 'More than a week ago', labelKn: 'ಒಂದು ವಾರಕ್ಕಿಂತ ಹೆಚ್ಚು ಕಾಲ', icon: '⌛' },
        ],
      },
      {
        id: 'q9',
        textEn: 'Do you have your Aadhaar card?',
        textKn: 'ನಿಮ್ಮ ಬಳಿ ಆಧಾರ್ ಕಾರ್ಡ್ ಇದೆಯೇ?',
        type: 'camera',
        cameraPromptEn: 'Please show your Aadhaar card',
        cameraPromptKn: 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ಆಧಾರ್ ಕಾರ್ಡ್ ತೋರಿಸಿ',
      },
      {
        id: 'q10',
        textEn: 'Submit insurance claim now?',
        textKn: 'ಈಗಲೇ ವಿಮಾ ಕ್ಲೈಮ್ ಸಲ್ಲಿಸುವಿರಾ?',
        type: 'yesno',
        options: YES_NO_OPTIONS,
      },
      {
        id: 'q11',
        textEn: 'Download or Submit?',
        textKn: 'ಡೌನ್‌ಲೋಡ್ ಅಥವಾ ಸಲ್ಲಿಸಿ?',
        type: 'multiple',
        options: [
          { id: 'download', labelEn: 'Download PDF', labelKn: 'ಪಿಡಿಎಫ್ ಡೌನ್‌ಲೋಡ್ ಮಾಡಿ' },
          { id: 'submit', labelEn: 'Submit Application', labelKn: 'ಅರ್ಜಿ ಸಲ್ಲಿಸಿ' },
          { id: 'both', labelEn: 'Both (Download & Submit)', labelKn: 'ಎರಡೂ (ಡೌನ್‌ಲೋಡ್ ಮತ್ತು ಸಲ್ಲಿಸಿ)' },
        ],
      },
    ],
  },
};
