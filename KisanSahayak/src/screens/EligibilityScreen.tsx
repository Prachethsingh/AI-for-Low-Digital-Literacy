/**
 * EligibilityScreen — Yes/No eligibility questions.
 * MD3: Card, Button, ProgressBar, Surface, Avatar, ActivityIndicator.
 * No hardcoded hex colors.
 */
import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, Animated, useWindowDimensions } from 'react-native';
import {
  Text,
  Card,
  Button,
  ProgressBar,
  useTheme,
  ActivityIndicator,
  Surface,
  Avatar,
} from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useAppContext } from '../context/AppContext';
import { getEligibleSchemes } from '../constants/schemes';
import LanguageToggle from '../components/LanguageToggle';

type Props = NativeStackScreenProps<RootStackParamList, 'Eligibility'>;
type Step = 'farmer' | 'aadhaar' | 'woman' | 'loading';

export default function EligibilityScreen({ navigation, route }: Props) {
  const { category } = route.params;
  const { language, setAnswer, backendUrl, updateHistory } = useAppContext();
  const theme = useTheme();
  const { width: screenWidth } = useWindowDimensions();
  const isLargeScreen = screenWidth > 600;

  const cardPadding = isLargeScreen ? 48 : 32;
  const avatarSize = isLargeScreen ? 160 : 120;
  const btnHeight = isLargeScreen ? 100 : 80;
  const btnFontSize = isLargeScreen ? 26 : 22;

  const [step, setStep] = useState<Step>(category === 'women' ? 'aadhaar' : 'farmer');
  const [isFarmer, setIsFarmer] = useState<boolean>(category === 'farmer');
  const [hasAadhaar, setHasAadhaar] = useState<boolean | null>(null);

  const slideAnim = useRef(new Animated.Value(50)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    animateIn();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const animateIn = () => {
    slideAnim.setValue(50);
    opacityAnim.setValue(0);
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 350,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 350,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const goToSchemes = async (farmer: boolean, aadhaar: boolean, woman: boolean) => {
    setStep('loading');
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
      schemeIds = getEligibleSchemes(farmer, aadhaar, woman).map(s => s.id);
    }
    updateHistory({ eligibleSchemes: schemeIds });
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

  if (step === 'loading') {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
        <View style={styles.loadingContainer}>
          <Text variant="displayLarge">🔍</Text>
          <ActivityIndicator
            size="large"
            color={theme.colors.primary}
            style={{ marginTop: 24 }}
          />
          <Text
            variant="headlineSmall"
            style={[styles.loadingText, { color: theme.colors.primary }]}
          >
            {language === 'kannada' ? 'ನಿಮ್ಮ ಯೋಜನೆ ಹುಡುಕುತ್ತಿದ್ದೇವೆ…' : 'Finding your schemes…'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const questions: Record<string, { kn: string; en: string; icon: string }> = {
    farmer: { kn: 'ನೀವು ರೈತರೇ?', en: 'Are you a farmer?', icon: 'sprout' },
    aadhaar: {
      kn: 'ನಿಮಗೆ ಆಧಾರ್ ಕಾರ್ಡ್ ಇದೆಯೇ?',
      en: 'Do you have an Aadhaar Card?',
      icon: 'card-account-details',
    },
    woman: { kn: 'ನೀವು ಮಹಿಳೆಯೇ?', en: 'Are you a woman?', icon: 'face-woman' },
  };

  const stepProgress = ({ farmer: 1, aadhaar: 2, woman: 3 } as Record<Step, number>)[step] ?? 1;
  const totalSteps = category === 'women' ? 1 : 3;
  const q = questions[step];
  const isKan = language === 'kannada';

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      {/* Header */}
      <Surface
        style={[styles.header, { backgroundColor: theme.colors.primary }]}
        elevation={2}
      >
        <View style={{ flex: 1 }}>
          <Text
            variant="labelLarge"
            style={[styles.stepLabel, { color: theme.colors.onPrimary }]}
          >
            {isKan ? `ಹಂತ ${stepProgress} / ${totalSteps}` : `Step ${stepProgress} of ${totalSteps}`}
          </Text>
          <ProgressBar
            progress={stepProgress / totalSteps}
            color={theme.colors.onPrimary}
            style={styles.progressBar}
          />
        </View>
        <LanguageToggle />
      </Surface>

      {/* Question card */}
      <Animated.View
        style={[
          styles.questionCardWrapper,
          { opacity: opacityAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <Card style={styles.questionCard} mode="elevated" elevation={4}>
          <Card.Content style={styles.cardContent}>
            <Avatar.Icon
              size={avatarSize}
              icon={q?.icon}
              style={{ backgroundColor: theme.colors.primaryContainer, marginBottom: 24 }}
              color={theme.colors.onPrimaryContainer}
            />
            <Text
              variant="headlineMedium"
              style={[styles.questionText, { color: theme.colors.onSurface }]}
            >
              {isKan ? q?.kn : q?.en}
            </Text>
          </Card.Content>
        </Card>
      </Animated.View>

      {/* Yes / No big buttons */}
      <View style={styles.buttonsRow}>
        <Button
          mode="contained"
          onPress={() => handleAnswer(true)}
          style={styles.halfBtn}
          contentStyle={[styles.btnContent, { height: btnHeight }]}
          labelStyle={[styles.btnLabel, { fontSize: btnFontSize }]}
          icon="check-circle"
          buttonColor={theme.colors.tertiary}
        >
          {isKan ? 'ಹೌದು' : 'Yes'}
        </Button>
        <Button
          mode="contained"
          onPress={() => handleAnswer(false)}
          style={styles.halfBtn}
          contentStyle={[styles.btnContent, { height: btnHeight }]}
          labelStyle={[styles.btnLabel, { fontSize: btnFontSize }]}
          icon="close-circle"
          buttonColor={theme.colors.error}
        >
          {isKan ? 'ಇಲ್ಲ' : 'No'}
        </Button>
      </View>

      <Text
        variant="bodyMedium"
        style={[styles.hint, { color: theme.colors.onSurfaceVariant }]}
      >
        {isKan ? 'ಉತ್ತರ ಆಯ್ಕೆ ಮಾಡಲು ಒತ್ತಿ' : 'Tap your answer above'}
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  stepLabel: {
    fontWeight: '700',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    width: '80%',
  },
  questionCardWrapper: {
    margin: 20,
    marginTop: 40,
  },
  questionCard: {
    borderRadius: 32,
  },
  cardContent: {
    padding: 32,
    alignItems: 'center',
  },
  questionText: {
    fontWeight: '900',
    textAlign: 'center',
    lineHeight: 38,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 16,
    marginHorizontal: 20,
    marginTop: 16,
  },
  halfBtn: {
    flex: 1,
    borderRadius: 24,
  },
  btnContent: {
  },
  btnLabel: {
    fontWeight: '900',
  },
  hint: {
    textAlign: 'center',
    marginTop: 24,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontWeight: '700',
    marginTop: 16,
    textAlign: 'center',
  },
});
