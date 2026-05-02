import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useAppContext } from '../context/AppContext';
import { t } from '../constants/translations';

export default function LanguageToggle() {
  const { language, toggleLanguage } = useAppContext();
  return (
    <TouchableOpacity onPress={toggleLanguage} style={styles.btn} activeOpacity={0.75}>
      <Text style={styles.text}>{t('languageToggle', language)}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  text: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
