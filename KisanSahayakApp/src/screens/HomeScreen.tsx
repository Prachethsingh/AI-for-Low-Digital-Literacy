/**
 * HomeScreen – Zero-literacy landing screen.
 * 3 big icon buttons + language toggle.
 * No menus, no typing, no navigation complexity.
 */
import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Animated,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useAppContext } from '../context/AppContext';
import LanguageToggle from '../components/LanguageToggle';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const { language } = useAppContext();

  // Staggered card entry animations
  const fadeCards = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];
  const headerSlide = useRef(new Animated.Value(-30)).current;
  const headerOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerSlide, { toValue: 0, duration: 500, useNativeDriver: true }),
      Animated.timing(headerOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      ...fadeCards.map((anim, i) =>
        Animated.timing(anim, {
          toValue: 1,
          duration: 400,
          delay: 300 + i * 100,
          useNativeDriver: true,
        })
      ),
    ]).start();
  }, []);

  const actions = [
    {
      icon: '🎤',
      labelKn: 'ಮಾತನಾಡಿ',
      labelEn: 'Speak & Ask',
      subKn: 'ಯೋಜನೆ ಬಗ್ಗೆ ಕೇಳಿ',
      subEn: 'Ask about any scheme',
      color: '#1B5E20',
      onPress: () => navigation.navigate('VoiceQuery'),
    },
    {
      icon: '🌾',
      labelKn: 'ಯೋಜನೆ ಪರಿಶೀಲಿಸಿ',
      labelEn: 'Check Schemes',
      subKn: 'ನಿಮಗೆ ಅರ್ಹ ಯೋಜನೆ ಕಂಡುಹಿಡಿಯಿರಿ',
      subEn: 'Find schemes you qualify for',
      color: '#2E7D32',
      onPress: () => navigation.navigate('Category'),
    },
    {
      icon: '📞',
      labelKn: 'ಸಹಾಯ ಸಾಲು',
      labelEn: 'Helpline',
      subKn: 'ಕಿಸಾನ್ ಸಹಾಯ: 155261',
      subEn: 'Kisan Helpline: 155261',
      color: '#0277BD',
      onPress: () => Linking.openURL('tel:155261'),
    },
    {
      icon: '🇮🇳',
      labelKn: 'ಎಲ್ಲ ಯೋಜನೆ',
      labelEn: 'All Schemes',
      subKn: 'ಎಲ್ಲಾ ಸರ್ಕಾರಿ ಯೋಜನೆ ನೋಡಿ',
      subEn: 'Browse all government schemes',
      color: '#6A1B9A',
      onPress: () =>
        navigation.navigate('SchemeList', {
          schemeIds: [], // empty = show all
        }),
    },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <Animated.View
        style={[
          styles.header,
          { opacity: headerOpacity, transform: [{ translateY: headerSlide }] },
        ]}
      >
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.appName}>
              {language === 'kannada' ? '🌾 ಕಿಸಾನ್ ಸಹಾಯಕ' : '🌾 Kisan Sahayak'}
            </Text>
            <Text style={styles.tagline}>
              {language === 'kannada'
                ? 'ಸರ್ಕಾರಿ ಯೋಜನೆಗಳ ಮಾರ್ಗದರ್ಶಿ'
                : 'Your Guide to Government Schemes'}
            </Text>
          </View>
          <LanguageToggle />
        </View>

        {/* Hero message */}
        <View style={styles.heroBox}>
          <Text style={styles.heroText}>
            {language === 'kannada'
              ? '👋 ನಮಸ್ಕಾರ! ನಿಮಗೆ ಯಾವ ಸರ್ಕಾರಿ ಯೋಜನೆ ಸಿಗುತ್ತದೆ ಎಂದು ತಿಳಿದುಕೊಳ್ಳಿ.'
              : '👋 Hello! Find out which government schemes you are eligible for.'}
          </Text>
        </View>
      </Animated.View>

      {/* Action grid */}
      <ScrollView
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      >
        {actions.map((action, i) => (
          <Animated.View
            key={i}
            style={[
              styles.cardWrapper,
              { opacity: fadeCards[i] },
            ]}
          >
            <TouchableOpacity
              style={[styles.card, { borderLeftColor: action.color }]}
              onPress={action.onPress}
              activeOpacity={0.82}
            >
              <Text style={styles.cardIcon}>{action.icon}</Text>
              <View style={styles.cardText}>
                <Text style={[styles.cardLabel, { color: action.color }]}>
                  {language === 'kannada' ? action.labelKn : action.labelEn}
                </Text>
                <Text style={styles.cardSub}>
                  {language === 'kannada' ? action.subKn : action.subEn}
                </Text>
              </View>
              <Text style={[styles.cardArrow, { color: action.color }]}>›</Text>
            </TouchableOpacity>
          </Animated.View>
        ))}

        {/* Footer */}
        <Text style={styles.footer}>
          {language === 'kannada'
            ? 'ಎಲ್ಲ ಮಾಹಿತಿ ಸರ್ಕಾರಿ ಮೂಲಗಳಿಂದ • Karnataka India'
            : 'All info from official government sources • Karnataka India'}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F5F1E8',
  },
  header: {
    backgroundColor: '#1B5E20',
    paddingTop: 16,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  appName: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.75)',
    marginTop: 2,
  },
  heroBox: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 14,
    padding: 14,
    marginTop: 16,
  },
  heroText: {
    fontSize: 16,
    color: '#E8F5E9',
    lineHeight: 24,
    fontWeight: '500',
  },
  grid: {
    paddingTop: 20,
    paddingBottom: 40,
  },
  cardWrapper: {
    marginHorizontal: 20,
    marginVertical: 8,
  },
  card: {
    backgroundColor: '#FFFDF5',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 22,
    paddingHorizontal: 20,
    borderLeftWidth: 7,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },
  cardIcon: {
    fontSize: 40,
    marginRight: 16,
  },
  cardText: {
    flex: 1,
  },
  cardLabel: {
    fontSize: 20,
    fontWeight: '800',
  },
  cardSub: {
    fontSize: 13,
    color: '#666',
    marginTop: 4,
    lineHeight: 18,
  },
  cardArrow: {
    fontSize: 28,
    fontWeight: '300',
  },
  footer: {
    textAlign: 'center',
    fontSize: 11,
    color: '#999',
    marginTop: 24,
    paddingHorizontal: 20,
  },
});
