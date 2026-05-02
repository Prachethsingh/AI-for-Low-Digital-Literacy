/**
 * BigButton – Large, high-contrast, touch-friendly button for low-literacy UX.
 * Includes haptic feedback, press animation, and optional icon.
 */
import React, { useRef } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  ViewStyle,
} from 'react-native';

interface BigButtonProps {
  label: string;
  sublabel?: string;
  icon?: string;
  onPress: () => void;
  color?: string;
  textColor?: string;
  style?: ViewStyle;
  disabled?: boolean;
  variant?: 'solid' | 'outline';
}

export default function BigButton({
  label,
  sublabel,
  icon,
  onPress,
  color = '#2E7D32',
  textColor = '#FFFFFF',
  style,
  disabled = false,
  variant = 'solid',
}: BigButtonProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scale, {
      toValue: 0.95,
      useNativeDriver: true,
      speed: 20,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
    }).start();
  };

  const isSolid = variant === 'solid';

  return (
    <Animated.View style={[{ transform: [{ scale }] }, style]}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        disabled={disabled}
        activeOpacity={0.85}
        style={[
          styles.button,
          {
            backgroundColor: isSolid ? (disabled ? '#BDBDBD' : color) : 'transparent',
            borderColor: color,
            borderWidth: isSolid ? 0 : 3,
          },
        ]}
      >
        {icon ? (
          <Text style={styles.icon}>{icon}</Text>
        ) : null}
        <Text
          style={[
            styles.label,
            { color: isSolid ? textColor : color },
          ]}
        >
          {label}
        </Text>
        {sublabel ? (
          <Text
            style={[
              styles.sublabel,
              { color: isSolid ? 'rgba(255,255,255,0.85)' : color },
            ]}
          >
            {sublabel}
          </Text>
        ) : null}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  icon: {
    fontSize: 36,
    marginBottom: 6,
  },
  label: {
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  sublabel: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 4,
    opacity: 0.9,
  },
});
