/**
 * SchemeDetailScreen — full scheme info with audio, apply button.
 * MD3: Appbar, Card, Button, Avatar, Surface, Divider, TouchableRipple.
 * No hardcoded hex — uses theme.colors tokens everywhere.
 */
import React from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, Linking, useWindowDimensions } from 'react-native';
import {
  Text,
  Button,
  useTheme,
  Appbar,
  Card,
  Avatar,
  Surface,
  Divider,
  TouchableRipple,
} from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Tts from 'react-native-tts';
import { RootStackParamList } from '../../App';
import { SCHEMES } from '../constants/schemes';
import { useAppContext } from '../context/AppContext';
import { Alert } from 'react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'SchemeDetail'>;

export default function SchemeDetailScreen({ navigation, route }: Props) {
  const { schemeId } = route.params;
  const { language, history, updateHistory } = useAppContext();
  const theme = useTheme();
  const { width: screenWidth } = useWindowDimensions();
  const isLargeScreen = screenWidth > 600;

  const bannerPadding = isLargeScreen ? 48 : 32;
  const bannerIconSize = isLargeScreen ? 'displayLarge' : 'displayMedium';
  const audioBarMargin = isLargeScreen ? 32 : 20;
  const applyBtnHeight = isLargeScreen ? 80 : 64;
  const applyBtnFont = isLargeScreen ? 24 : 20;

  const scheme = SCHEMES.find(s => s.id === schemeId);

  if (!scheme) {
    return null;
  }

  const isKan = language === 'kannada';
  const name = isKan ? scheme.name_kn : scheme.name_en;
  const description = isKan ? scheme.description_kn : scheme.description_en;

  const playAudio = () => {
    Tts.stop();
    Tts.setDefaultLanguage(isKan ? 'kn-IN' : 'en-IN');
    Tts.speak(description);
  };

    }
  };

  const isFavorite = history.eligibleSchemes.includes(schemeId);

  const toggleFavorite = () => {
    let newList = [...history.eligibleSchemes];
    if (isFavorite) {
      newList = newList.filter(id => id !== schemeId);
      Alert.alert(isKan ? 'ತೆಗೆದುಹಾಕಲಾಗಿದೆ' : 'Removed', isKan ? 'ಯೋಜನೆಯನ್ನು ಮೆಚ್ಚಿನವುಗಳಿಂದ ತೆಗೆದುಹಾಕಲಾಗಿದೆ' : 'Scheme removed from favorites');
    } else {
      newList.push(schemeId);
      Alert.alert(isKan ? 'ಸೇರಿಸಲಾಗಿದೆ' : 'Saved', isKan ? 'ಯೋಜನೆಯನ್ನು ಮೆಚ್ಚಿನವುಗಳಿಗೆ ಸೇರಿಸಲಾಗಿದೆ' : 'Scheme saved to your favorites');
    }
    updateHistory({ eligibleSchemes: newList });
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header style={{ backgroundColor: theme.colors.primary }}>
        <Appbar.BackAction
          onPress={() => navigation.goBack()}
          color={theme.colors.onPrimary}
        />
        <Appbar.Content
          title={name}
          titleStyle={[styles.headerTitle, { color: theme.colors.onPrimary }]}
        />
        <Appbar.Action 
          icon={isFavorite ? "heart" : "heart-outline"} 
          color={isFavorite ? "#FF5252" : theme.colors.onPrimary} 
          onPress={toggleFavorite} 
        />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Scheme banner */}
        <Surface
          style={[styles.banner, { backgroundColor: scheme.color, padding: bannerPadding }]}
          elevation={2}
        >
          <Text variant={bannerIconSize} style={styles.bannerIcon}>
            {scheme.icon}
          </Text>
          <Text variant="headlineMedium" style={[styles.bannerName, { color: theme.colors.surface }]}>
            {name}
          </Text>
        </Surface>

        {/* Audio assistant bar */}
        <TouchableRipple
          onPress={playAudio}
          style={[styles.audioBarRipple, { marginHorizontal: audioBarMargin }]}
          rippleColor="rgba(255,255,255,0.2)"
        >
          <Surface
            style={[styles.audioBar, { backgroundColor: theme.colors.tertiary }]}
            elevation={4}
          >
            <Avatar.Icon
              size={isLargeScreen ? 50 : 40}
              icon="volume-high"
              style={{ backgroundColor: 'transparent' }}
              color={theme.colors.onTertiary}
            />
            <Text
              variant="titleMedium"
              style={[styles.audioText, { color: theme.colors.onTertiary }]}
            >
              {isKan ? 'ಮಾಹಿತಿ ಕೇಳಲು ಒತ್ತಿ' : 'Tap to hear info'}
            </Text>
          </Surface>
        </TouchableRipple>

        {/* Detail card */}
        <Card style={styles.detailsCard} mode="elevated">
          <Card.Content>
            <Text
              variant="titleLarge"
              style={[styles.sectionTitle, { color: theme.colors.primary }]}
            >
              {isKan ? 'ಯೋಜನೆಯ ವಿವರ' : 'Scheme Details'}
            </Text>
            <Divider style={styles.divider} />
            <Text
              variant="bodyLarge"
              style={[styles.description, { color: theme.colors.onSurface }]}
            >
              {description}
            </Text>

            <Surface
              style={[styles.infoGrid, { backgroundColor: theme.colors.surfaceVariant }]}
              elevation={0}
            >
              <View style={styles.infoItem}>
                <Text
                  variant="labelSmall"
                  style={[styles.infoLabel, { color: theme.colors.onSurfaceVariant }]}
                >
                  {isKan ? 'ಸಹಾಯವಾಣಿ' : 'Helpline'}
                </Text>
                <Button
                  mode="text"
                  onPress={() => Linking.openURL(`tel:${scheme.helpline}`)}
                  icon="phone"
                  style={{ alignSelf: 'flex-start' }}
                  textColor={theme.colors.primary}
                >
                  {scheme.helpline}
                </Button>
              </View>
            </Surface>
          </Card.Content>
        </Card>

        {/* Apply CTA */}
        <Button
          mode="contained"
          onPress={handleApply}
          style={[styles.applyBtn, { backgroundColor: scheme.color }]}
          contentStyle={[styles.applyContent, { height: applyBtnHeight }]}
          labelStyle={[styles.applyLabel, { fontSize: applyBtnFont }]}
          icon="launch"
        >
          {isKan ? 'ಅರ್ಜಿ ಸಲ್ಲಿಸಿ' : 'Apply Now'}
        </Button>
        <Text
          variant="labelSmall"
          style={[styles.urlHint, { color: theme.colors.onSurfaceVariant }]}
        >
          {scheme.apply_url.replace('https://', '')}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  headerTitle: {
    fontWeight: '800',
  },
  content: { paddingBottom: 60 },
  banner: {
    alignItems: 'center',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  bannerIcon: { marginBottom: 12 },
  bannerName: {
    fontWeight: '900',
    textAlign: 'center',
  },
  audioBarRipple: {
    marginTop: -24,
    borderRadius: 20,
  },
  audioBar: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  audioText: { fontWeight: '800', marginLeft: 8 },
  detailsCard: {
    margin: 20,
    marginTop: 24,
    borderRadius: 24,
  },
  sectionTitle: {
    fontWeight: '900',
  },
  divider: { marginVertical: 12 },
  description: {
    lineHeight: 28,
  },
  infoGrid: {
    marginTop: 24,
    borderRadius: 16,
    padding: 16,
  },
  infoItem: {
    marginVertical: 4,
  },
  infoLabel: {
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  applyBtn: {
    marginHorizontal: 24,
    marginTop: 24,
    borderRadius: 20,
  },
  applyContent: { },
  applyLabel: { fontWeight: '900' },
  urlHint: {
    textAlign: 'center',
    marginTop: 8,
  },
});
