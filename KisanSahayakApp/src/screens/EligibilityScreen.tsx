/**
 * EligibilityScreen – One-question-per-screen big Yes/No flow.
 * Asks: farmer? → aadhaar? → woman? → fetches eligible schemes.
 */
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useAppContext } from '../context/AppContext';
import BigButton from '../components/BigButton';
import { getEligibleSchemes } from '../constants/schemes';
import LanguageToggle from '../components/LanguageToggle';

type Props = NativeStackScreenProps<RootStackParamList, 'Eligibility'>;

type Step = 'farmer' | 'aadhaar' | 'woman' | 'loading';

export default function EligibilityScreen({ navigation, route }: Props) {
  const { category } = route.params;
  const { language, setAnswer, backendUrl } = useAppContext();

  const [step, setStep] = useState<Step>(
    category === 'women' ? 'aadhaar' : 'farmer'
  );
  const [isFarmer, setIsFarmer] = useState<boolean>(category === 'farmer');
  const [hasAadhaar, setHasAadhaar] = useState<boolean | null>(null);

  const slideAnim = useRef(new Animated.Value(50)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    animateIn();
  }, [step]);

  const animateIn = () => {
    slideAnim.setValue(50);
    opacityAnim.setValue(0);
    Animated.parallel([
      Animated.timing(slideAnim, { toValue: 0, duration: 350, useNativeDriver: true }),
      Animated.timing(opacityAnim, { toValue: 1, duration: 350, useNativeDriver: true }),
    ]).start();
  };

  const goToSchemes = async (farmer: boolean, aadhaar: boolean, woman: boolean) => {
    setStep('loading');

    // Try backend first; fall back to local rule-engine
    let schemeIds: string[] = [];
    try {
      const resp = await fetch(`${backendUrl}/eligibility`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          is_farmer: farmer,
          has_aadhaar: aadhaar,
          is_woman: woman,
          language,
        }),
      });
      const data = await resp.json();
      schemeIds = (data.eligible_schemes ?? []).map((s: any) => s.id);
    } catch {
      // Offline fallback
      schemeIds = getEligibleSchemes(farmer, aadhaar, woman).map(s => s.id);
    }

    navigation.replace('SchemeList', { schemeIds });
  };

  const handleAnswer = (answer: boolean) => {
    if (step === 'farmer') {
      setIsFarmer(answer);
      setAnswer('is_farmer', answer);
      setStep('aadhaar');
    } else if (step === 'aadhaar') {
      setHasAadhaar(answer);
      setAnswer('has_aadhaar', answer);
      if (category === 'women') {
        goToSchemes(isFarmer, answer, true);
      } else {
        setStep('woman');
      }
    } else if (step === 'woman') {
      setAnswer('is_woman', answer);
      goToSchemes(isFarmer, hasAadhaar ?? false, answer);
    }
  };

  // ── Render questions ───────────────────────────────────────────────────────

  if (step === 'loading') {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingIcon}>🔍</Text>
          <ActivityIndicator size="large" color="#2E7D32" style={{ marginTop: 20 }} />
          <Text style={styles.loadingText}>
            {language === 'kannada'
              ? 'ನಿಮ್ಮ ಯೋಜನೆ ಹುಡುಕುತ್ತಿದ್ದೇವೆ…'
              : 'Finding your schemes…'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const questions: Record<string, { kn: string; en: string; icon: string }> = {
    farmer: {
      kn: 'ನೀವು ರೈತರೇ?',
      en: 'Are you a farmer?',
      icon: '🌾',
    },
    aadhaar: {
      kn: 'ನಿಮಗೆ ಆಧಾರ್ ಕಾರ್ಡ್ ಇದೆಯೇ?',
      en: 'Do you have an Aadhaar Card?',
      icon: '🪪',
    },
    woman: {
      kn: 'ನೀವು ಮಹಿಳೆಯೇ?',
      en: 'Are you a woman?',
      icon: '👩',
    },
  };

  const stepProgress = { farmer: 1, aadhaar: 2, woman: 3 }[step] ?? 1;
  const totalSteps = category === 'women' ? 1 : 3;
  const q = questions[step];

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.stepLabel}>
            {language === 'kannada' ? `ಹಂತ ${stepProgress} / ${totalSteps}` : `Step ${stepProgress} of ${totalSteps}`}
          </Text>
          {/* Progress dots */}
          <View style={styles.dots}>
            {Array.from({ length: totalSteps }).map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  i < stepProgress ? styles.dotActive : styles.dotInactive,
                ]}
              />
            ))}
          </View>
        </View>
        <LanguageToggle />
      </View>

      {/* Question card */}
      <Animated.View
        style={[
          styles.questionCard,
          { opacity: opacityAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <Text style={styles.questionIcon}>{q?.icon}</Text>
        <Text style={styles.questionText}>
          {language === 'kannada' ? q?.kn : q?.en}
        </Text>
      </Animated.View>

      {/* Big Yes / No buttons */}
      <View style={styles.buttonsRow}>
        <BigButton
          icon="✅"
          label={language === 'kannada' ? 'ಹೌದು' : 'Yes'}
          onPress={() => handleAnswer(true)}
          color="#2E7D32"
          style={styles.halfBtn}
        />
        <BigButton
          icon="❌"
          label={language === 'kannada' ? 'ಇಲ್ಲ' : 'No'}
          onPress={() => handleAnswer(false)}
          color="#C62828"
          style={styles.halfBtn}
        />
      </View>

      <Text style={styles.hint}>
        {language === 'kannada'
          ? 'ಉತ್ತರ ಆಯ್ಕೆ ಮಾಡಲು ಒತ್ತಿ'
          : 'Tap your answer above'}
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F1E8' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1B5E20',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  stepLabel: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  dots: { flexDirection: 'row', gap: 8 },
  dot: {
    width: 28,
    height: 8,
    borderRadius: 4,
  },
  dotActive: { backgroundColor: '#A5D6A7' },
  dotInactive: { backgroundColor: 'rgba(255,255,255,0.3)' },
  questionCard: {
    backgroundColor: '#FFFDF5',
    borderRadius: 28,
    margin: 24,
    marginTop: 40,
    padding: 32,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
  },
  questionIcon: { fontSize: 64, marginBottom: 20 },
  questionText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1A1A1A',
    textAlign: 'center',
    lineHeight: 38,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 16,
    marginHorizontal: 24,
    marginTop: 16,
  },
  halfBtn: { flex: 1 },
  hint: {
    textAlign: 'center',
    color: '#888',
    fontSize: 14,
    marginTop: 20,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingIcon: { fontSize: 64 },
  loadingText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2E7D32',
    marginTop: 16,
    textAlign: 'center',
  },
});
