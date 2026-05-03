import Tts from 'react-native-tts';

/**
 * Global audio controller to manage speech playback.
 * Prevents overlapping voices during fast navigation.
 */
export const AudioController = {
  speak: (text: string, language: 'kannada' | 'english' = 'english') => {
    Tts.stop();
    // Tts language settings
    if (language === 'kannada') {
      Tts.setDefaultLanguage('hi-IN'); // Using Hindi as fallback for Kannada if not available, or custom voice
    } else {
      Tts.setDefaultLanguage('en-US');
    }
    Tts.speak(text);
  },
  
  stop: () => {
    Tts.stop();
  },
  
  init: () => {
    Tts.getInitStatus().then(() => {
      Tts.setDefaultRate(0.5);
      Tts.setDefaultPitch(1.0);
    });
  }
};
