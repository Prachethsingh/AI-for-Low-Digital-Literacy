/**
 * LanguageToggle — MD3 Paper Button, theme-aware, compact pill shape.
 */
import React from 'react';
import { StyleSheet } from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import { useAppContext } from '../context/AppContext';

export default function LanguageToggle() {
  const { language, toggleLanguage } = useAppContext();
  const theme = useTheme();

  return (
    <Button
      mode="contained-tonal"
      onPress={toggleLanguage}
      style={styles.btn}
      labelStyle={styles.label}
      compact
    >
      {language === 'kannada' ? 'En' : 'ಕನ್ನಡ'}
    </Button>
  );
}

const styles = StyleSheet.create({
  btn: {
    borderRadius: 20,
    minWidth: 60,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    marginVertical: 4,
  },
});
