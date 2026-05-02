/**
 * SchemeCard — MD3 elevated Card with theme-aware colors.
 * No hardcoded hex. Scheme category color used only for accent strip.
 */
import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Text, Card, IconButton, useTheme } from 'react-native-paper';
import { Scheme } from '../constants/schemes';
import { Language } from '../constants/translations';

interface SchemeCardProps {
  scheme: Scheme;
  language: Language;
  onPress: () => void;
  style?: ViewStyle;
}

export default function SchemeCard({ scheme, language, onPress, style }: SchemeCardProps) {
  const theme = useTheme();
  const name = language === 'kannada' ? scheme.name_kn : scheme.name_en;
  const tagline = language === 'kannada' ? scheme.tagline_kn : scheme.tagline_en;

  return (
    <Card
      onPress={onPress}
      style={[styles.card, style]}
      mode="elevated"
      elevation={2}
    >
      <View style={styles.content}>
        {/* Scheme-branded left accent strip */}
        <View style={[styles.colorStrip, { backgroundColor: scheme.color }]} />

        {/* Icon badge */}
        <View style={[styles.iconBox, { backgroundColor: scheme.color + '22' }]}>
          <Text style={styles.icon}>{scheme.icon}</Text>
        </View>

        {/* Title + tagline */}
        <View style={styles.textBox}>
          <Text
            variant="titleMedium"
            style={[styles.name, { color: theme.colors.onSurface }]}
            numberOfLines={2}
          >
            {name}
          </Text>
          <Text
            variant="bodySmall"
            style={[styles.tagline, { color: theme.colors.onSurfaceVariant }]}
            numberOfLines={2}
          >
            {tagline}
          </Text>
        </View>

        {/* Chevron */}
        <IconButton icon="chevron-right" iconColor={scheme.color} size={28} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 20,
    marginVertical: 8,
    borderRadius: 20,
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 100,
  },
  colorStrip: {
    width: 8,
    alignSelf: 'stretch',
  },
  iconBox: {
    width: 60,
    height: 60,
    borderRadius: 16,
    marginHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 32,
  },
  textBox: {
    flex: 1,
    paddingVertical: 16,
    paddingRight: 4,
  },
  name: {
    fontWeight: '900',
  },
  tagline: {
    marginTop: 4,
  },
});
