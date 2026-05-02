/**
 * HomeScreen — main dashboard.
 * MD3: Card, Avatar.Icon, Surface, Text, IconButton from react-native-paper.
 * Staggered entrance animations. No hardcoded hex colors.
 */
import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Animated,
  Linking,
  useWindowDimensions,
} from 'react-native';
import {
  Text,
  Card,
  Avatar,
  useTheme,
  IconButton,
  Surface,
} from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useAppContext } from '../context/AppContext';
import LanguageToggle from '../components/LanguageToggle';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const ACTION_ICONS = ['microphone', 'sprout', 'phone-in-talk', 'view-list'];

export default function HomeScreen({ navigation }: Props) {
  const { language } = useAppContext();
  const theme = useTheme();
  const { width: screenWidth } = useWindowDimensions();
  const isLargeScreen = screenWidth > 600;

  const headerPadding = isLargeScreen ? 32 : 24;
  const avatarSize = isLargeScreen ? 80 : 64;
  const appNameSize = isLargeScreen ? 'displaySmall' : 'headlineMedium';

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
      Animated.timing(headerSlide, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(headerOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      ...fadeCards.map((anim, i) =>
        Animated.timing(anim, {
          toValue: 1,
          duration: 400,
          delay: 300 + i * 120,
          useNativeDriver: true,
        })
      ),
    ]).start();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isKan = language === 'kannada';

  const actions = [
    {
      icon: ACTION_ICONS[0],
      labelKn: 'ಮಾತನಾಡಿ',
      labelEn: 'Speak & Ask',
      subKn: 'ಯೋಜನೆ ಬಗ್ಗೆ ಕೇಳಿ',
      subEn: 'Ask about any scheme',
      onPress: () => navigation.navigate('VoiceQuery'),
    },
    {
      icon: ACTION_ICONS[1],
      labelKn: 'ಯೋಜನೆ ಪರಿಶೀಲಿಸಿ',
      labelEn: 'Check Schemes',
      subKn: 'ನಿಮಗೆ ಅರ್ಹ ಯೋಜನೆ ಕಂಡುಹಿಡಿಯಿರಿ',
      subEn: 'Find schemes you qualify for',
      onPress: () => navigation.navigate('Category'),
    },
    {
      icon: ACTION_ICONS[2],
      labelKn: 'ಸಹಾಯ ಸಾಲು',
      labelEn: 'Helpline',
      subKn: 'ಕಿಸಾನ್ ಸಹಾಯ: 155261',
      subEn: 'Kisan Helpline: 155261',
      onPress: () => Linking.openURL('tel:155261'),
    },
    {
      icon: ACTION_ICONS[3],
      labelKn: 'ಎಲ್ಲ ಯೋಜನೆ',
      labelEn: 'All Schemes',
      subKn: 'ಎಲ್ಲಾ ಸರ್ಕಾರಿ ಯೋಜನೆ ನೋಡಿ',
      subEn: 'Browse all government schemes',
      onPress: () => navigation.navigate('SchemeList', { schemeIds: [] }),
    },
  ];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      {/* Animated header */}
      <Animated.View
        style={[
          styles.header,
          {
            opacity: headerOpacity,
            transform: [{ translateY: headerSlide }],
            backgroundColor: theme.colors.primary,
          },
        ]}
      >
        <View style={styles.headerTop}>
          <View>
            <Text variant={appNameSize} style={[styles.appName, { color: theme.colors.onPrimary }]}>
              🌾 {isKan ? 'ಕಿಸಾನ್ ಸಹಾಯಕ' : 'Kisan Sahayak'}
            </Text>
            <Text
              variant="labelMedium"
              style={[styles.tagline, { color: theme.colors.onPrimary }]}
            >
              {isKan ? 'ಸರ್ಕಾರಿ ಯೋಜನೆಗಳ ಮಾರ್ಗದರ್ಶಿ' : 'Your Guide to Government Schemes'}
            </Text>
          </View>
          <LanguageToggle />
        </View>

        {/* Hero message */}
        <Surface style={styles.heroBox} elevation={0}>
          <Text variant="bodyLarge" style={[styles.heroText, { color: theme.colors.onPrimary }]}>
            {isKan
              ? '👋 ನಮಸ್ಕಾರ! ನಿಮಗೆ ಯಾವ ಸರ್ಕಾರಿ ಯೋಜನೆ ಸಿಗುತ್ತದೆ ಎಂದು ತಿಳಿದುಕೊಳ್ಳಿ.'
              : '👋 Hello! Find out which government schemes you are eligible for.'}
          </Text>
        </Surface>
      </Animated.View>

      {/* Action cards */}
      <ScrollView
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      >
        {actions.map((action, i) => (
          <Animated.View
            key={i}
            style={[styles.cardWrapper, { opacity: fadeCards[i] }]}
          >
            <Card
              style={styles.card}
              onPress={action.onPress}
              mode="elevated"
              elevation={2}
            >
              <Card.Content style={styles.cardContent}>
                <Avatar.Icon
                  size={avatarSize}
                  icon={action.icon}
                  style={{ backgroundColor: theme.colors.primaryContainer }}
                  color={theme.colors.onPrimaryContainer}
                />
                <View style={styles.cardText}>
                  <Text
                    variant="titleLarge"
                    style={[styles.cardLabel, { color: theme.colors.primary }]}
                  >
                    {isKan ? action.labelKn : action.labelEn}
                  </Text>
                  <Text
                    variant="bodyMedium"
                    style={[styles.cardSub, { color: theme.colors.onSurfaceVariant }]}
                  >
                    {isKan ? action.subKn : action.subEn}
                  </Text>
                </View>
                <IconButton
                  icon="chevron-right"
                  iconColor={theme.colors.primary}
                  size={32}
                />
              </Card.Content>
            </Card>
          </Animated.View>
        ))}

        <Text
          variant="labelSmall"
          style={[styles.footer, { color: theme.colors.onSurfaceVariant }]}
        >
          {isKan
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
  },
  header: {
    paddingTop: 16,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  appName: {
    fontWeight: '900',
  },
  tagline: {
    marginTop: 2,
    opacity: 0.85,
  },
  heroBox: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    padding: 16,
    marginTop: 20,
  },
  heroText: {
    lineHeight: 24,
    fontWeight: '500',
  },
  grid: {
    paddingTop: 16,
    paddingBottom: 40,
  },
  cardWrapper: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  card: {
    borderRadius: 24,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  cardText: {
    flex: 1,
    marginLeft: 16,
  },
  cardLabel: {
    fontWeight: '800',
  },
  cardSub: {
    marginTop: 2,
  },
  footer: {
    textAlign: 'center',
    marginTop: 32,
    paddingHorizontal: 20,
  },
});
