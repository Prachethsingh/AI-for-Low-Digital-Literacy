/**
 * BigButton — large, accessible MD3 action button.
 * Spring press animation, fully theme-aware, no hardcoded hex.
 */
import React, { useRef } from 'react';
import { StyleSheet, Animated, ViewStyle, View } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';

interface BigButtonProps {
  label: string;
  sublabel?: string;
  icon?: string;
  onPress: () => void;
  color?: string;
  style?: ViewStyle;
  disabled?: boolean;
  variant?: 'solid' | 'outline';
}

export default function BigButton({
  label,
  sublabel,
  icon,
  onPress,
  color,
  style,
  disabled = false,
  variant = 'solid',
}: BigButtonProps) {
  const theme = useTheme();
  const buttonColor = color ?? theme.colors.primary;
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scale, {
      toValue: 0.96,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const isSolid = variant === 'solid';

  return (
    <Animated.View style={[{ transform: [{ scale }] }, style]}>
      <Button
        mode={isSolid ? 'contained' : 'outlined'}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        disabled={disabled}
        buttonColor={isSolid ? buttonColor : 'transparent'}
        textColor={isSolid ? theme.colors.onPrimary : buttonColor}
        style={[
          styles.button,
          !isSolid && { borderColor: buttonColor, borderWidth: 2 },
        ]}
        contentStyle={styles.content}
        labelStyle={styles.label}
      >
        <View style={styles.textContainer}>
          {icon ? <Text style={styles.icon}>{icon}</Text> : null}
          <Text
            variant="headlineSmall"
            style={[
              styles.label,
              { color: isSolid ? theme.colors.onPrimary : buttonColor },
            ]}
          >
            {label}
          </Text>
          {sublabel ? (
            <Text
              variant="bodySmall"
              style={[
                styles.sublabel,
                {
                  color: isSolid
                    ? theme.colors.onPrimary
                    : theme.colors.onSurfaceVariant,
                  opacity: 0.85,
                },
              ]}
            >
              {sublabel}
            </Text>
          ) : null}
        </View>
      </Button>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 24,
    elevation: 4,
  },
  content: {
    paddingVertical: 16,
    minHeight: 100,
  },
  textContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 40,
    marginBottom: 4,
  },
  label: {
    fontWeight: '900',
    textAlign: 'center',
  },
  sublabel: {
    marginTop: 4,
    fontWeight: '700',
    textAlign: 'center',
  },
});
