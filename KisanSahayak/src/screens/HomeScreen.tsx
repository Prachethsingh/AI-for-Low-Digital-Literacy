/**
 * HomeScreen — main dashboard.
 * MD3: Card, Avatar.Icon, Surface, Text, IconButton from react-native-paper.
 * Staggered entrance animations. No hardcoded hex colors.
 */
import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, useWindowDimensions, Animated as RNAnimated, Linking } from 'react-native';
import { Text, Avatar, IconButton, useTheme, Button, TouchableRipple } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useAppContext } from '../context/AppContext';
import NeumorphicView from '../components/NeumorphicView';
import Animated, { FadeInUp } from 'react-native-reanimated';
import LanguageToggle from '../components/LanguageToggle';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const { language, history, userProfile, logout } = useAppContext();
  const theme = useTheme();
  const { width: screenWidth } = useWindowDimensions();
  const isLargeScreen = screenWidth > 600;

  const avatarSize = isLargeScreen ? 80 : 64;
  const appNameSize = isLargeScreen ? 'displaySmall' : 'headlineMedium';

  const isKan = language === 'kannada';

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { backgroundColor: theme.colors.primary }]}>
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
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <LanguageToggle />
            <IconButton 
              icon="cog" 
              iconColor={theme.colors.onPrimary} 
              onPress={() => navigation.navigate('Settings')} 
              size={24}
            />
            <IconButton 
              icon="logout" 
              iconColor={theme.colors.onPrimary} 
              onPress={logout} 
              size={24}
            />
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        {userProfile && (
          <Animated.View entering={FadeInUp.delay(50)} style={styles.profileContainer}>
            <NeumorphicView style={styles.profileCard}>
              <View style={styles.profileHeader}>
                <Avatar.Text 
                  size={48} 
                  label={userProfile.name.charAt(0).toUpperCase()} 
                  style={{ backgroundColor: theme.colors.primary }}
                />
                <View style={styles.profileInfo}>
                  <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
                    {userProfile.name}
                  </Text>
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                    {userProfile.phone}
                  </Text>
                </View>
              </View>
              
              <View style={styles.divider} />
              
              <View style={styles.docRow}>
                <View style={styles.docItem}>
                  <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
                    {isKan ? 'ಆಧಾರ್' : 'AADHAAR'}
                  </Text>
                  <Text variant="bodyMedium">
                    {userProfile.aadhaar ? `XXXX-XXXX-${userProfile.aadhaar.slice(-4)}` : (isKan ? 'ಸೇರಿಸಲಾಗಿಲ್ಲ' : 'Not Added')}
                  </Text>
                </View>
                <View style={styles.docItem}>
                  <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
                    {isKan ? 'ಪಾನ್' : 'PAN'}
                  </Text>
                  <Text variant="bodyMedium">
                    {userProfile.pan ? `${userProfile.pan.slice(0, 5)}XXXX` : (isKan ? 'ಸೇರಿಸಲಾಗಿಲ್ಲ' : 'Not Added')}
                  </Text>
                </View>
              </View>
            </NeumorphicView>
          </Animated.View>
        )}

        {/* Main Actions */}
        <View style={styles.actionGrid}>
          <Animated.View entering={FadeInUp.delay(100)} style={styles.actionItem}>
            <NeumorphicView style={styles.neumorphicAction}>
              <TouchableRipple
                onPress={() => navigation.navigate('VoiceQuery')}
                style={styles.ripple}
                borderless
              >
                <View style={styles.actionInner}>
                  <Avatar.Icon
                    size={avatarSize}
                    icon="chat-processing"
                    style={{ backgroundColor: theme.colors.primaryContainer }}
                    color={theme.colors.onPrimaryContainer}
                  />
                  <Text variant="titleMedium" style={styles.actionLabel}>
                    {isKan ? 'ಮಾತನಾಡಿ' : 'Talk to AI'}
                  </Text>
                </View>
              </TouchableRipple>
            </NeumorphicView>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(200)} style={styles.actionItem}>
            <NeumorphicView style={styles.neumorphicAction}>
              <TouchableRipple
                onPress={() => navigation.navigate('Category')}
                style={styles.ripple}
                borderless
              >
                <View style={styles.actionInner}>
                  <Avatar.Icon
                    size={avatarSize}
                    icon="clipboard-check"
                    style={{ backgroundColor: theme.colors.secondaryContainer }}
                    color={theme.colors.onSecondaryContainer}
                  />
                  <Text variant="titleMedium" style={styles.actionLabel}>
                    {isKan ? 'ಅರ್ಹತೆ' : 'Eligibility'}
                  </Text>
                </View>
              </TouchableRipple>
            </NeumorphicView>
          </Animated.View>
        </View>

        <View style={styles.actionGrid}>
          <Animated.View entering={FadeInUp.delay(300)} style={styles.actionItem}>
            <NeumorphicView style={styles.neumorphicAction}>
              <TouchableRipple
                onPress={() => Linking.openURL('tel:155261')}
                style={styles.ripple}
                borderless
              >
                <View style={styles.actionInner}>
                  <Avatar.Icon
                    size={avatarSize}
                    icon="phone-in-talk"
                    style={{ backgroundColor: theme.colors.tertiaryContainer }}
                    color={theme.colors.onTertiaryContainer}
                  />
                  <Text variant="titleMedium" style={styles.actionLabel}>
                    {isKan ? 'ಸಹಾಯ ಸಾಲು' : 'Helpline'}
                  </Text>
                </View>
              </TouchableRipple>
            </NeumorphicView>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(400)} style={styles.actionItem}>
            <NeumorphicView style={styles.neumorphicAction}>
              <TouchableRipple
                onPress={() => navigation.navigate('SchemeList', { schemeIds: [] })}
                style={styles.ripple}
                borderless
              >
                <View style={styles.actionInner}>
                  <Avatar.Icon
                    size={avatarSize}
                    icon="view-list"
                    style={{ backgroundColor: theme.colors.surfaceDisabled }}
                    color={theme.colors.onSurface}
                  />
                  <Text variant="titleMedium" style={styles.actionLabel}>
                    {isKan ? 'ಎಲ್ಲ ಯೋಜನೆ' : 'All Schemes'}
                  </Text>
                </View>
              </TouchableRipple>
            </NeumorphicView>
          </Animated.View>
        </View>

        <View style={styles.actionGrid}>
          <Animated.View entering={FadeInUp.delay(500)} style={styles.actionItem}>
            <NeumorphicView style={styles.neumorphicAction}>
              <TouchableRipple
                onPress={() => navigation.navigate('DocumentVault')}
                style={styles.ripple}
                borderless
              >
                <View style={styles.actionInner}>
                  <Avatar.Icon
                    size={avatarSize}
                    icon="safe-square"
                    style={{ backgroundColor: theme.colors.primaryContainer }}
                    color={theme.colors.onPrimaryContainer}
                  />
                  <Text variant="titleMedium" style={styles.actionLabel}>
                    {isKan ? 'ದಾಖಲೆಗಳು' : 'Documents'}
                  </Text>
                </View>
              </TouchableRipple>
            </NeumorphicView>
          </Animated.View>
        </View>

        {/* Daily Tip Section */}
        <Animated.View entering={FadeInUp.delay(200)} style={styles.tipSection}>
          <NeumorphicView style={styles.tipCard}>
            <View style={styles.tipHeader}>
              <Avatar.Icon size={32} icon="lightbulb-on" style={{ backgroundColor: theme.colors.tertiary }} color="white" />
              <Text variant="titleSmall" style={[styles.tipTitle, { color: theme.colors.tertiary }]}>
                {isKan ? 'ಇಂದಿನ ಸಲಹೆ' : 'Daily Tip'}
              </Text>
            </View>
            <Text variant="bodyMedium" style={styles.tipText}>
              {isKan 
                ? 'ನಿಮ್ಮ ಮಣ್ಣಿನ ಫಲವತ್ತತೆ ಹೆಚ್ಚಿಸಲು ಸಾವಯವ ಗೊಬ್ಬರ ಬಳಸಿ. ಇದು ಭೂಮಿಯ ಆರೋಗ್ಯವನ್ನು ಕಾಪಾಡುತ್ತದೆ.'
                : 'Use organic fertilizers to increase soil fertility. It helps maintain the long-term health of your land.'}
            </Text>
          </NeumorphicView>
        </Animated.View>

        {/* History / Insights Section */}
        {history?.eligibleSchemes && history.eligibleSchemes.length > 0 && (
          <Animated.View entering={FadeInUp.delay(300)} style={styles.historySection}>
            <Text variant="titleLarge" style={styles.sectionTitle}>
              {isKan ? 'ನಿಮ್ಮ ಇತ್ತೀಚಿನ ಚಟುವಟಿಕೆ' : 'Your Recent Activity'}
            </Text>
            <NeumorphicView style={styles.historyCard}>
              <View style={styles.historyRow}>
                <IconButton icon="history" size={24} />
                <Text variant="bodyLarge">
                  {isKan 
                    ? `${history.eligibleSchemes.length} ಯೋಜನೆಗಳು ಲಭ್ಯವಿವೆ`
                    : `${history.eligibleSchemes.length} schemes found for you`}
                </Text>
              </View>
              <Button 
                mode="text" 
                onPress={() => navigation.navigate('SchemeList', { schemeIds: history.eligibleSchemes })}
              >
                {isKan ? 'ನೋಡಿ' : 'View All'}
              </Button>
            </NeumorphicView>
          </Animated.View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    paddingTop: 16,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  appName: { fontWeight: '900' },
  tagline: { marginTop: 2, opacity: 0.85 },
  actionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  actionItem: { width: '48%' },
  neumorphicAction: { padding: 0, height: 160 },
  ripple: { flex: 1, borderRadius: 24 },
  actionInner: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 },
  actionLabel: { marginTop: 12, fontWeight: '800', textAlign: 'center' },
  historySection: { marginTop: 32, paddingHorizontal: 20 },
  tipSection: { marginTop: 32, paddingHorizontal: 20 },
  tipCard: { padding: 16, borderRadius: 24 },
  tipHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  tipTitle: { marginLeft: 8, fontWeight: '900', textTransform: 'uppercase' },
  tipText: { lineHeight: 22, opacity: 0.8 },
  sectionTitle: { marginBottom: 16, fontWeight: '900' },
  historyCard: { padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  historyRow: { flexDirection: 'row', alignItems: 'center' },
  profileContainer: { paddingHorizontal: 20, marginTop: 20 },
  profileCard: { padding: 16, borderRadius: 24 },
  profileHeader: { flexDirection: 'row', alignItems: 'center' },
  profileInfo: { marginLeft: 12 },
  divider: { height: 1, backgroundColor: '#DDD', marginVertical: 12, opacity: 0.5 },
  docRow: { flexDirection: 'row', justifyContent: 'space-between' },
  docItem: { flex: 1 },
});
