/**
 * SchemeCard – Big, finger-friendly card for displaying a scheme in list view.
 */
import React from 'react';
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Scheme } from '../constants/schemes';
import { Language } from '../constants/translations';

interface SchemeCardProps {
  scheme: Scheme;
  language: Language;
  onPress: () => void;
  style?: ViewStyle;
}

export default function SchemeCard({ scheme, language, onPress, style }: SchemeCardProps) {
  const name = language === 'kannada' ? scheme.name_kn : scheme.name_en;
  const tagline = language === 'kannada' ? scheme.tagline_kn : scheme.tagline_en;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.82}
      style={[styles.card, style]}
    >
      {/* Left color strip */}
      <View style={[styles.colorStrip, { backgroundColor: scheme.color }]} />

      {/* Icon */}
      <View style={[styles.iconBox, { backgroundColor: scheme.color + '22' }]}>
        <Text style={styles.icon}>{scheme.icon}</Text>
      </View>

      {/* Text */}
      <View style={styles.textBox}>
        <Text style={styles.name} numberOfLines={2}>{name}</Text>
        <Text style={styles.tagline} numberOfLines={2}>{tagline}</Text>
      </View>

      {/* Arrow */}
      <Text style={[styles.arrow, { color: scheme.color }]}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFDF5',
    borderRadius: 20,
    marginHorizontal: 20,
    marginVertical: 8,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    alignItems: 'center',
    minHeight: 90,
  },
  colorStrip: {
    width: 7,
    alignSelf: 'stretch',
  },
  iconBox: {
    width: 64,
    height: 64,
    borderRadius: 16,
    margin: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 32,
  },
  textBox: {
    flex: 1,
    paddingVertical: 14,
    paddingRight: 8,
  },
  name: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1A1A1A',
    lineHeight: 22,
  },
  tagline: {
    fontSize: 13,
    color: '#555',
    marginTop: 4,
    lineHeight: 18,
  },
  arrow: {
    fontSize: 30,
    fontWeight: '300',
    paddingRight: 16,
  },
});
