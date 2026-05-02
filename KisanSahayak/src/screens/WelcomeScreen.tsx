/**
 * WelcomeScreen — voice-enabled welcome with flow shortcuts.
 * MD3: Card, Button, IconButton, Surface, Text. No hardcoded hex.
 */
import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Text, Card, IconButton, Button, useTheme, Surface } from 'react-native-paper';
import { RootStackParamList } from '../../App';
import { useAppContext } from '../context/AppContext';
import { FLOWS } from '../constants/flows';
import Tts from 'react-native-tts';
import VoiceRecorder from '../components/VoiceRecorder';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Welcome'>;

export default function WelcomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { language, setLanguage } = useAppContext();
  const theme = useTheme();
  const { width: screenWidth } = useWindowDimensions();
  const isLargeScreen = screenWidth > 600;

  const greetingSize = isLargeScreen ? 'displayMedium' : 'displaySmall';
  const micHeight = isLargeScreen ? 200 : 160;
  const cardIconSize = isLargeScreen ? 72 : 56;

  const isKan = language === 'kannada';
  const greeting = isKan ? 'ನಮಸ್ತೆ!' : 'Namaste!';
  const subGreeting = isKan ? 'ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಲ್ಲೆ?' : 'How can I help you?';

  useEffect(() => {
    Tts.setDefaultLanguage('hi-IN');
    Tts.speak(`${greeting} ${subGreeting}`);
  }, [greeting, subGreeting]);

  const handleSelect = (flowId: string) => {
    navigation.navigate('Question', { flowId, step: 0 });
  };

  const toggleLanguage = () => {
    setLanguage(isKan ? 'english' : 'kannada');
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <IconButton icon="menu" size={24} onPress={() => {}} />
          <Button
            mode="outlined"
            onPress={toggleLanguage}
            style={styles.langToggle}
            labelStyle={styles.langText}
            compact
          >
            {isKan ? 'En' : 'ಕನ್ನಡ'}
          </Button>
        </View>

        {/* Greeting */}
        <View style={styles.greetingContainer}>
          <Text variant={greetingSize} style={[styles.greetingTitle, { color: theme.colors.onBackground }]}>
            {greeting} <Text style={{ fontSize: isLargeScreen ? 40 : 32 }}>👋</Text>
          </Text>
          <Text
            variant="titleMedium"
            style={[styles.greetingSub, { color: theme.colors.secondary }]}
          >
            {subGreeting}
          </Text>
        </View>

        {/* Mic area */}
        <View style={styles.micContainer}>
          <VoiceRecorder
            onTranscript={text => {
              const t = text.toLowerCase();
              if (t.includes('kisan') || t.includes('samman') || t.includes('money')) {
                handleSelect('pm_kisan');
              } else if (
                t.includes('bima') ||
                t.includes('insurance') ||
                t.includes('crop')
              ) {
                handleSelect('pmfby');
              }
            }}
          />
        </View>

        {/* Flows list */}
        <Text
          variant="labelLarge"
          style={[styles.iWantToText, { color: theme.colors.onSurfaceVariant }]}
        >
          {isKan ? 'ನನಗೆ ಬೇಕಾಗಿರುವುದು...' : 'I want to…'}
        </Text>

        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {Object.values(FLOWS).map(flow => (
            <Card
              key={flow.id}
              style={styles.card}
              onPress={() => handleSelect(flow.id)}
              mode="elevated"
              elevation={1}
            >
              <Card.Content style={styles.cardContent}>
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: theme.colors.primaryContainer, width: cardIconSize, height: cardIconSize, borderRadius: cardIconSize / 2 },
                  ]}
                >
                  <Text style={[styles.icon, { fontSize: isLargeScreen ? 36 : 28 }]}>{flow.icon}</Text>
                </View>
                <View style={styles.textContainer}>
                  <Text
                    variant="titleLarge"
                    style={[styles.title, { color: theme.colors.onSurface }]}
                  >
                    {isKan ? flow.titleKn : flow.titleEn}
                  </Text>
                  <Text
                    variant="bodySmall"
                    style={{ color: theme.colors.onSurfaceVariant }}
                  >
                    {isKan ? 'ಹೆಚ್ಚಿನ ಮಾಹಿತಿ ಪಡೆಯಲು ಟ್ಯಾಪ್ ಮಾಡಿ' : 'Tap to learn more'}
                  </Text>
                </View>
                <IconButton
                  icon="chevron-right"
                  iconColor={theme.colors.primary}
                  size={24}
                />
              </Card.Content>
            </Card>
          ))}
        </ScrollView>

        {/* Footer */}
        <Surface style={styles.footer} elevation={0}>
          <Text variant="labelMedium" style={{ color: theme.colors.primary }}>
            ✨ Powered by AI Assistant
          </Text>
        </Surface>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  langToggle: { borderRadius: 20 },
  langText: { fontSize: 14, fontWeight: 'bold' },
  greetingContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  greetingTitle: {
    fontWeight: '900',
    textAlign: 'center',
  },
  greetingSub: {
    textAlign: 'center',
    marginTop: 4,
  },
  micContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  iWantToText: {
    marginBottom: 12,
    marginLeft: 4,
  },
  scroll: { paddingBottom: 24 },
  card: {
    marginBottom: 12,
    borderRadius: 16,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  icon: { fontSize: 28 },
  textContainer: { flex: 1 },
  title: { fontWeight: '700' },
  footer: {
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: 'transparent',
  },
});
