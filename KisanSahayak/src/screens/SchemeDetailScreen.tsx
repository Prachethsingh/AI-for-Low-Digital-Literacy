import React from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, Linking } from 'react-native';
import { Text, Button, IconButton, useTheme, Card, Avatar, List, Divider } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { SCHEMES } from '../constants/schemes';
import { useAppContext } from '../context/AppContext';
import NeumorphicView from '../components/NeumorphicView';

type Props = NativeStackScreenProps<RootStackParamList, 'SchemeDetail'>;

export default function SchemeDetailScreen({ route, navigation }: Props) {
  const { schemeId } = route.params;
  const { language } = useAppContext();
  const theme = useTheme();
  const isKan = language === 'kannada';

  const scheme = SCHEMES.find(s => s.id === schemeId);

  if (!scheme) {
    return (
      <View style={styles.error}>
        <Text>Scheme not found</Text>
      </View>
    );
  }

  const handleApply = () => {
    Linking.openURL(scheme.apply_url);
  };

  const handleCall = () => {
    Linking.openURL(`tel:${scheme.helpline}`);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={[styles.hero, { backgroundColor: scheme.color }]}>
          <View style={styles.heroHeader}>
            <IconButton 
              icon="chevron-left" 
              iconColor="white" 
              onPress={() => navigation.goBack()} 
            />
            <IconButton 
              icon="volume-high" 
              iconColor="white" 
              onPress={() => AudioController.speak(isKan ? scheme.description_kn : scheme.description_en, language)} 
            />
            <IconButton 
              icon="share-variant" 
              iconColor="white" 
              onPress={() => {}} 
            />
          </View>
          <View style={styles.heroContent}>
            <Text style={styles.heroIcon}>{scheme.icon}</Text>
            <Text variant="headlineMedium" style={styles.heroTitle}>
              {isKan ? scheme.name_kn : scheme.name_en}
            </Text>
            <Text variant="titleMedium" style={styles.heroTagline}>
              {isKan ? scheme.tagline_kn : scheme.tagline_en}
            </Text>
          </View>
        </View>

        <View style={styles.body}>
          {/* Eligibility Badge */}
          <NeumorphicView style={styles.eligibilityCard}>
            <View style={styles.row}>
              <Avatar.Icon size={40} icon="check-decagram" style={{ backgroundColor: theme.colors.primaryContainer }} color={theme.colors.onPrimaryContainer} />
              <View style={{ marginLeft: 12 }}>
                <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
                  {isKan ? 'ನೀವು ಅರ್ಹರಾಗಿದ್ದೀರಿ' : 'You are Eligible'}
                </Text>
                <Text variant="bodySmall">
                  {isKan ? 'ಸಿಸ್ಟಮ್ ಪರಿಶೀಲಿಸಿದಂತೆ' : 'Verified by system checks'}
                </Text>
              </View>
            </View>
          </NeumorphicView>

          {/* Description */}
          <View style={styles.section}>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              {isKan ? 'ಯೋಜನೆಯ ಬಗ್ಗೆ' : 'About the Scheme'}
            </Text>
            <Text variant="bodyLarge" style={styles.description}>
              {isKan ? scheme.description_kn : scheme.description_en}
            </Text>
          </View>

          <Divider style={styles.divider} />

          {/* Requirements */}
          <View style={styles.section}>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              {isKan ? 'ಅಗತ್ಯ ದಾಖಲೆಗಳು' : 'Requirements'}
            </Text>
            <List.Item
              title={isKan ? 'ಆಧಾರ್ ಕಾರ್ಡ್' : 'Aadhaar Card'}
              left={props => <List.Icon {...props} icon={scheme.requires_aadhaar ? "check-circle" : "information-outline"} color={scheme.requires_aadhaar ? theme.colors.primary : theme.colors.outline} />}
            />
            <List.Item
              title={isKan ? 'ರೈತ ದೃಢೀಕರಣ' : 'Farmer Status'}
              left={props => <List.Icon {...props} icon={scheme.requires_farmer ? "check-circle" : "information-outline"} color={scheme.requires_farmer ? theme.colors.primary : theme.colors.outline} />}
            />
          </View>

          {/* Contact */}
          <View style={styles.section}>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              {isKan ? 'ಸಹಾಯಕ್ಕಾಗಿ ಸಂಪರ್ಕಿಸಿ' : 'Contact Support'}
            </Text>
            <Card mode="contained" style={styles.contactCard} onPress={handleCall}>
              <Card.Title
                title={scheme.helpline}
                subtitle={isKan ? 'ಸಹಾಯವಾಣಿ ಸಂಖ್ಯೆ' : 'Helpline Number'}
                left={props => <Avatar.Icon {...props} icon="phone" />}
              />
            </Card>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Footer */}
      <View style={[styles.footer, { backgroundColor: theme.colors.surface }]}>
        <Button 
          mode="contained" 
          onPress={handleApply} 
          style={styles.applyBtn}
          contentStyle={{ height: 56 }}
          labelStyle={{ fontSize: 18, fontWeight: 'bold' }}
        >
          {isKan ? 'ಈಗಲೇ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ' : 'Apply Now'}
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  hero: {
    paddingTop: 16,
    paddingBottom: 40,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  heroContent: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  heroIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  heroTitle: {
    color: 'white',
    fontWeight: '900',
    textAlign: 'center',
  },
  heroTagline: {
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginTop: 8,
  },
  body: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  eligibilityCard: {
    marginTop: -30,
    padding: 16,
    borderRadius: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    marginTop: 32,
  },
  sectionTitle: {
    fontWeight: '900',
    marginBottom: 16,
  },
  description: {
    lineHeight: 26,
    opacity: 0.8,
  },
  divider: {
    marginTop: 32,
  },
  contactCard: {
    borderRadius: 16,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  applyBtn: {
    borderRadius: 16,
  },
  error: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
