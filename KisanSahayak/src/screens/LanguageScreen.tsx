/**
 * LanguageScreen — first screen, bilingual language selection.
 * MD3: Surface, Button, Text from react-native-paper. No hardcoded hex.
 */
import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Text, Button, Surface, useTheme } from 'react-native-paper';
import { RootStackParamList } from '../../App';
import { useAppContext } from '../context/AppContext';
import Tts from 'react-native-tts';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Language'>;

export default function LanguageScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { setLanguage } = useAppContext();
  const theme = useTheme();

  useEffect(() => {
    Tts.setDefaultLanguage('hi-IN');
    Tts.speak(
      'ನಮಸ್ತೆ. ದಯವಿಟ್ಟು ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆ ಮಾಡಿ. Namaste. Please select your language.',
    );
  }, []);

  const handleSelect = (lang: 'english' | 'kannada') => {
    setLanguage(lang);
    navigation.navigate('Home');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Surface style={styles.surface} elevation={0}>
        {/* App icon placeholder */}
        <Text style={styles.emoji}>🌾</Text>

        <Text
          variant="headlineLarge"
          style={[styles.appName, { color: theme.colors.primary }]}
        >
          Kisan Sahayak
        </Text>

        <Text
          variant="displaySmall"
          style={[styles.title, { color: theme.colors.onBackground }]}
        >
          ಭಾಷೆ ಆಯ್ಕೆ ಮಾಡಿ{'\n'}
          <Text variant="displaySmall" style={{ color: theme.colors.onSurfaceVariant }}>
            Select Language
          </Text>
        </Text>

        <Button
          mode="contained"
          onPress={() => handleSelect('kannada')}
          style={styles.button}
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonLabel}
        >
          ಕನ್ನಡ (Kannada)
        </Button>

        <Button
          mode="outlined"
          onPress={() => handleSelect('english')}
          style={styles.button}
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonLabel}
        >
          English
        </Button>
      </Surface>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  surface: {
    padding: 16,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  emoji: {
    fontSize: 72,
    marginBottom: 16,
  },
  appName: {
    fontWeight: '900',
    marginBottom: 8,
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 48,
    lineHeight: 52,
  },
  button: {
    width: '100%',
    marginBottom: 20,
    borderRadius: 16,
  },
  buttonContent: {
    paddingVertical: 12,
  },
  buttonLabel: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
