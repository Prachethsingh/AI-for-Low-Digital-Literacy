/**
 * SchemeDetailScreen – Full screen for one scheme.
 * Features: Localized text + Text-to-Speech audio guide.
 */
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Linking,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Tts from 'react-native-tts';
import { RootStackParamList } from '../../App';
import { SCHEMES } from '../constants/schemes';
import { useAppContext } from '../context/AppContext';
import BigButton from '../components/BigButton';

type Props = NativeStackScreenProps<RootStackParamList, 'SchemeDetail'>;

export default function SchemeDetailScreen({ navigation, route }: Props) {
  const { schemeId } = route.params;
  const { language } = useAppContext();
  const scheme = SCHEMES.find(s => s.id === schemeId);

  if (!scheme) return null;

  const name = language === 'kannada' ? scheme.name_kn : scheme.name_en;
  const description = language === 'kannada' ? scheme.description_kn : scheme.description_en;

  const playAudio = () => {
    Tts.stop();
    Tts.setDefaultLanguage(language === 'kannada' ? 'kn-IN' : 'en-IN');
    Tts.speak(description);
  };

  const handleApply = () => {
    if (scheme.apply_url) Linking.openURL(scheme.apply_url);
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>‹ {language === 'kannada' ? 'ಹಿಂದೆ' : 'Back'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{name}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Banner */}
        <View style={[styles.banner, { backgroundColor: scheme.color }]}>
          <Text style={styles.bannerIcon}>{scheme.icon}</Text>
          <Text style={styles.bannerName}>{name}</Text>
        </View>

        {/* Audio Assistant */}
        <TouchableOpacity
          onPress={playAudio}
          style={styles.audioBar}
          activeOpacity={0.8}
        >
          <Text style={styles.audioIcon}>🔊</Text>
          <Text style={styles.audioText}>
            {language === 'kannada' ? 'ಮಾಹಿತಿ ಕೇಳಲು ಒತ್ತಿ' : 'Tap to hear info'}
          </Text>
        </TouchableOpacity>

        {/* Details */}
        <View style={styles.detailsBox}>
          <Text style={styles.sectionTitle}>
            {language === 'kannada' ? 'ಯೋಜನೆಯ ವಿವರ' : 'Scheme Details'}
          </Text>
          <Text style={styles.description}>{description}</Text>

          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>
                {language === 'kannada' ? 'ಸಹಾಯವಾಣಿ' : 'Helpline'}
              </Text>
              <TouchableOpacity onPress={() => Linking.openURL(`tel:${scheme.helpline}`)}>
                <Text style={styles.infoVal}>{scheme.helpline}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Apply Button */}
        <BigButton
          label={language === 'kannada' ? 'ಅರ್ಜಿ ಸಲ್ಲಿಸಿ' : 'Apply Now'}
          sublabel={scheme.apply_url.replace('https://', '')}
          onPress={handleApply}
          color={scheme.color}
          style={styles.applyBtn}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F1E8' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1B5E20',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  backBtn: { padding: 4 },
  backText: { color: '#fff', fontSize: 17, fontWeight: '600' },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
    marginLeft: 16,
    flex: 1,
  },
  content: { paddingBottom: 40 },
  banner: {
    padding: 30,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  bannerIcon: { fontSize: 72, marginBottom: 12 },
  bannerName: {
    fontSize: 24,
    fontWeight: '900',
    color: '#fff',
    textAlign: 'center',
  },
  audioBar: {
    flexDirection: 'row',
    backgroundColor: '#3E2723',
    margin: 20,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  audioIcon: { fontSize: 24, marginRight: 12 },
  audioText: { color: '#fff', fontSize: 18, fontWeight: '800' },
  detailsBox: {
    paddingHorizontal: 24,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#333',
    marginBottom: 12,
  },
  description: {
    fontSize: 17,
    lineHeight: 28,
    color: '#444',
  },
  infoGrid: {
    marginTop: 24,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  infoItem: {
    marginVertical: 4,
  },
  infoLabel: { fontSize: 12, color: '#888', textTransform: 'uppercase' },
  infoVal: { fontSize: 18, color: '#1565C0', fontWeight: '700', marginTop: 2 },
  applyBtn: { margin: 24 },
});
