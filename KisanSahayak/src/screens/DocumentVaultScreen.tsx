import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {
  Text,
  useTheme,
  IconButton,
  Avatar,
  ProgressBar,
  Button,
} from 'react-native-paper';
import { useAppContext } from '../context/AppContext';
import NeumorphicView from '../components/NeumorphicView';
import Animated, { FadeInLeft } from 'react-native-reanimated';

export default function DocumentVaultScreen() {
  const { userProfile, language } = useAppContext();
  const theme = useTheme();
  const isKan = language === 'kannada';

  const docs = [
    { id: 'aadhaar', titleEn: 'Aadhaar Card', titleKn: 'ಆಧಾರ್ ಕಾರ್ಡ್', icon: 'card-account-details', value: userProfile?.aadhaar },
    { id: 'pan', titleEn: 'PAN Card', titleKn: 'ಪಾನ್ ಕಾರ್ಡ್', icon: 'card-text', value: userProfile?.pan },
    { id: 'land', titleEn: 'Land Records', titleKn: 'ಭೂ ದಾಖಲೆಗಳು', icon: 'map-marker-path', value: null },
    { id: 'income', titleEn: 'Income Certificate', titleKn: 'ಆದಾಯ ಪ್ರಮಾಣಪತ್ರ', icon: 'file-document-outline', value: null },
  ];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <IconButton icon="chevron-left" onPress={() => {}} />
        <Text variant="headlineSmall" style={styles.headerTitle}>
          {isKan ? 'ದಾಖಲೆಗಳ ಖಜಾನೆ' : 'Document Vault'}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.summaryBox}>
          <Text variant="titleMedium">
            {isKan ? 'ಪೂರ್ಣಗೊಂಡಿದೆ' : 'Completion Status'}
          </Text>
          <ProgressBar 
            progress={0.5} 
            color={theme.colors.primary} 
            style={styles.progress} 
          />
          <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
            {isKan ? '2/4 ದಾಖಲೆಗಳು ಲಭ್ಯವಿವೆ' : '2 of 4 documents verified'}
          </Text>
        </View>

        {docs.map((doc, index) => (
          <Animated.View 
            entering={FadeInLeft.delay(index * 100)} 
            key={doc.id}
            style={styles.docItem}
          >
            <NeumorphicView style={styles.card}>
              <View style={styles.cardContent}>
                <Avatar.Icon 
                  size={48} 
                  icon={doc.icon} 
                  style={{ backgroundColor: doc.value ? theme.colors.primaryContainer : theme.colors.surfaceVariant }}
                  color={doc.value ? theme.colors.onPrimaryContainer : theme.colors.onSurfaceVariant}
                />
                <View style={styles.textWrap}>
                  <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>
                    {isKan ? doc.titleKn : doc.titleEn}
                  </Text>
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                    {doc.value 
                      ? (isKan ? 'ಪರಿಶೀಲಿಸಲಾಗಿದೆ' : 'Verified') 
                      : (isKan ? 'ಅಗತ್ಯವಿದೆ' : 'Action Required')}
                  </Text>
                </View>
                {doc.value ? (
                  <IconButton icon="check-circle" iconColor={theme.colors.primary} />
                ) : (
                  <Button 
                    mode="contained-tonal" 
                    compact 
                    onPress={() => {}}
                    style={styles.scanBtn}
                  >
                    {isKan ? 'ಸ್ಕ್ಯಾನ್' : 'Scan'}
                  </Button>
                )}
              </View>
            </NeumorphicView>
          </Animated.View>
        ))}

        <NeumorphicView style={styles.infoCard}>
          <IconButton icon="information" iconColor={theme.colors.secondary} />
          <Text variant="bodySmall" style={styles.infoText}>
            {isKan 
              ? 'ನಿಮ್ಮ ದಾಖಲೆಗಳನ್ನು ಎನ್‌ಕ್ರಿಪ್ಟ್ ಮಾಡಲಾಗಿದೆ ಮತ್ತು ನಿಮ್ಮ ಫೋನ್‌ನಲ್ಲಿ ಸುರಕ್ಷಿತವಾಗಿ ಸಂಗ್ರಹಿಸಲಾಗಿದೆ.'
              : 'Your documents are encrypted and stored securely on your phone.'}
          </Text>
        </NeumorphicView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
    paddingHorizontal: 8,
  },
  headerTitle: { fontWeight: '900', marginLeft: 8 },
  scroll: { padding: 20 },
  summaryBox: {
    marginBottom: 32,
  },
  progress: {
    height: 12,
    borderRadius: 6,
    marginVertical: 12,
  },
  docItem: {
    marginBottom: 16,
  },
  card: {
    padding: 0,
    borderRadius: 20,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  textWrap: {
    flex: 1,
    marginLeft: 16,
  },
  scanBtn: {
    borderRadius: 12,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    padding: 12,
    backgroundColor: '#E8F5E9',
    borderRadius: 16,
  },
  infoText: { flex: 1, color: '#2E7D32' },
});
