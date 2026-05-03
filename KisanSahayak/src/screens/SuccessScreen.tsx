/**
 * SuccessScreen — application submitted confirmation.
 * MD3: Avatar, Button, Text, Surface, useTheme. No hardcoded hex.
 */
import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Text, Button, Avatar, useTheme, Surface } from 'react-native-paper';
import { RootStackParamList } from '../../App';
import { useAppContext } from '../context/AppContext';
import Tts from 'react-native-tts';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Success'>;
type RouteType = RouteProp<RootStackParamList, 'Success'>;

export default function SuccessScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteType>();
  const { messageEn, messageKn } = route.params;
  const { language } = useAppContext();
  const theme = useTheme();

  const message = language === 'kannada' ? messageKn : messageEn;

  useEffect(() => {
    Tts.setDefaultLanguage(language === 'kannada' ? 'kn-IN' : 'en-IN');
    Tts.speak(message);
  }, [message, language]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Surface style={styles.surface} elevation={0}>
        <Avatar.Icon
          size={120}
          icon="check-circle"
          style={[styles.icon, { backgroundColor: theme.colors.primaryContainer }]}
          color={theme.colors.onPrimaryContainer}
        />
        <Text
          variant="displaySmall"
          style={[styles.message, { color: theme.colors.primary }]}
        >
          {message}
        </Text>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('Home')}
          style={styles.button}
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonLabel}
        >
          {language === 'kannada' ? 'ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ' : 'Back to Home'}
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
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'transparent',
  },
  icon: {
    marginBottom: 48,
  },
  message: {
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 64,
    lineHeight: 48,
  },
  button: {
    width: '100%',
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
