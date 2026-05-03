/**
 * CategoryScreen — "Who are you?" selection.
 * MD3: Card, Avatar, Button, useTheme. No hardcoded hex.
 */
import React from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Text, Card, Avatar, Button, useTheme } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useAppContext } from '../context/AppContext';
import LanguageToggle from '../components/LanguageToggle';

type Props = NativeStackScreenProps<RootStackParamList, 'Category'>;

const CATEGORIES = [
  {
    id: 'farmer',
    icon: 'sprout',
    labelKn: 'ನಾನು ರೈತ',
    labelEn: 'I am a Farmer',
    subKn: 'ಕೃಷಿ ಭೂಮಿ ಹೊಂದಿದ್ದೇನೆ',
    subEn: 'I own / work on farmland',
  },
  {
    id: 'women',
    icon: 'face-woman',
    labelKn: 'ನಾನು ಮಹಿಳೆ',
    labelEn: 'I am a Woman',
    subKn: 'ಮಹಿಳಾ ಯೋಜನೆ ಪರಿಶೀಲಿಸಿ',
    subEn: 'Check women-specific schemes',
  },
  {
    id: 'all',
    icon: 'account-group',
    labelKn: 'ಸಾಮಾನ್ಯ ನಾಗರಿಕ',
    labelEn: 'General Citizen',
    subKn: 'ಎಲ್ಲ ಯೋಜನೆ ಪರಿಶೀಲಿಸಿ',
    subEn: 'Check all available schemes',
  },
];

export default function CategoryScreen({ navigation }: Props) {
  const { language, resetAnswers } = useAppContext();
  const theme = useTheme();
  const isKan = language === 'kannada';

  const handleSelect = (categoryId: string) => {
    resetAnswers();
    navigation.navigate('Eligibility', { category: categoryId });
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
        <Button
          mode="text"
          onPress={() => navigation.goBack()}
          textColor={theme.colors.onPrimary}
          icon="chevron-left"
          compact
        >
          {isKan ? 'ಹಿಂದೆ' : 'Back'}
        </Button>
        <LanguageToggle />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text
          variant="headlineLarge"
          style={[styles.question, { color: theme.colors.primary }]}
        >
          {isKan ? 'ನೀವು ಯಾರು?' : 'Who are you?'}
        </Text>
        <Text
          variant="bodyLarge"
          style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}
        >
          {isKan ? 'ನಿಮ್ಮ ಸ್ಥಿತಿ ಆಯ್ಕೆ ಮಾಡಿ' : 'Select your situation below'}
        </Text>

        {CATEGORIES.map(cat => (
          <Card
            key={cat.id}
            style={[styles.card, { borderColor: theme.colors.primary }]}
            onPress={() => handleSelect(cat.id)}
            mode="outlined"
          >
            <Card.Content style={styles.catContent}>
              <Avatar.Icon
                size={56}
                icon={cat.icon}
                style={{ backgroundColor: theme.colors.primaryContainer }}
                color={theme.colors.onPrimaryContainer}
              />
              <View style={styles.catText}>
                <Text
                  variant="titleLarge"
                  style={[styles.catLabel, { color: theme.colors.primary }]}
                >
                  {isKan ? cat.labelKn : cat.labelEn}
                </Text>
                <Text
                  variant="bodySmall"
                  style={[styles.catSub, { color: theme.colors.onSurfaceVariant }]}
                >
                  {isKan ? cat.subKn : cat.subEn}
                </Text>
              </View>
              <Avatar.Icon
                size={32}
                icon="chevron-right"
                style={{ backgroundColor: theme.colors.primaryContainer }}
                color={theme.colors.onPrimaryContainer}
              />
            </Card.Content>
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
  content: {
    padding: 24,
    paddingBottom: 48,
  },
  question: {
    fontWeight: '900',
    marginBottom: 8,
  },
  subtitle: {
    marginBottom: 32,
  },
  card: {
    borderRadius: 24,
    borderWidth: 2,
    marginBottom: 16,
  },
  catContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  catText: {
    flex: 1,
    marginLeft: 16,
  },
  catLabel: { fontWeight: '800' },
  catSub: { marginTop: 2 },
});
