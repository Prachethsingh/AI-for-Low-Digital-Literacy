/**
 * CategoryScreen – User picks who they are (farmer / woman / everyone).
 * Flows into EligibilityScreen for Yes/No questions.
 */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useAppContext } from '../context/AppContext';
import LanguageToggle from '../components/LanguageToggle';

type Props = NativeStackScreenProps<RootStackParamList, 'Category'>;

const CATEGORIES = [
  {
    id: 'farmer',
    icon: '🌾',
    labelKn: 'ನಾನು ರೈತ',
    labelEn: 'I am a Farmer',
    subKn: 'ಕೃಷಿ ಭೂಮಿ ಹೊಂದಿದ್ದೇನೆ',
    subEn: 'I own / work on farmland',
    color: '#2E7D32',
  },
  {
    id: 'women',
    icon: '👩',
    labelKn: 'ನಾನು ಮಹಿಳೆ',
    labelEn: 'I am a Woman',
    subKn: 'ಮಹಿಳಾ ಯೋಜನೆ ಪರಿಶೀಲಿಸಿ',
    subEn: 'Check women-specific schemes',
    color: '#C62828',
  },
  {
    id: 'all',
    icon: '🇮🇳',
    labelKn: 'ಸಾಮಾನ್ಯ ನಾಗರಿಕ',
    labelEn: 'General Citizen',
    subKn: 'ಎಲ್ಲ ಯೋಜನೆ ಪರಿಶೀಲಿಸಿ',
    subEn: 'Check all available schemes',
    color: '#1565C0',
  },
];

export default function CategoryScreen({ navigation }: Props) {
  const { language, resetAnswers } = useAppContext();

  const handleSelect = (categoryId: string) => {
    resetAnswers();
    navigation.navigate('Eligibility', { category: categoryId });
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>‹ {language === 'kannada' ? 'ಹಿಂದೆ' : 'Back'}</Text>
        </TouchableOpacity>
        <LanguageToggle />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.question}>
          {language === 'kannada' ? 'ನೀವು ಯಾರು?' : 'Who are you?'}
        </Text>
        <Text style={styles.subtitle}>
          {language === 'kannada'
            ? 'ನಿಮ್ಮ ಸ್ಥಿತಿ ಆಯ್ಕೆ ಮಾಡಿ'
            : 'Select your situation below'}
        </Text>

        {CATEGORIES.map(cat => (
          <TouchableOpacity
            key={cat.id}
            style={[styles.card, { borderColor: cat.color }]}
            onPress={() => handleSelect(cat.id)}
            activeOpacity={0.82}
          >
            <Text style={styles.catIcon}>{cat.icon}</Text>
            <View style={styles.catText}>
              <Text style={[styles.catLabel, { color: cat.color }]}>
                {language === 'kannada' ? cat.labelKn : cat.labelEn}
              </Text>
              <Text style={styles.catSub}>
                {language === 'kannada' ? cat.subKn : cat.subEn}
              </Text>
            </View>
            <View style={[styles.selectBtn, { backgroundColor: cat.color }]}>
              <Text style={styles.selectText}>›</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F1E8' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#1B5E20',
  },
  backBtn: { padding: 4 },
  backText: { color: '#fff', fontSize: 17, fontWeight: '600' },
  content: {
    padding: 24,
    paddingBottom: 48,
  },
  question: {
    fontSize: 30,
    fontWeight: '900',
    color: '#1B5E20',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 28,
  },
  card: {
    backgroundColor: '#FFFDF5',
    borderRadius: 22,
    borderWidth: 2.5,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  catIcon: { fontSize: 44, marginRight: 16 },
  catText: { flex: 1 },
  catLabel: { fontSize: 20, fontWeight: '800' },
  catSub: { fontSize: 13, color: '#666', marginTop: 4 },
  selectBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectText: { color: '#fff', fontSize: 24, fontWeight: '700' },
});
