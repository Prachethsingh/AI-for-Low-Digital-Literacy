import React from 'react';
import { View, StyleSheet, ViewStyle, Platform } from 'react-native';
import { useTheme } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
  borderRadius?: number;
  elevation?: number;
  isDark?: boolean;
}

/**
 * A skeuomorphic/neumorphic container with soft shadows and gradients.
 */
export default function NeumorphicView({
  children,
  style,
  borderRadius = 24,
  elevation = 8,
  isDark = false,
}: Props) {
  const theme = useTheme();
  
  // Custom shadow colors based on theme
  const lightShadow = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.8)';
  const darkShadow = isDark ? 'rgba(0,0,0,0.6)' : 'rgba(0,0,0,0.15)';

  return (
    <View style={[styles.container, { borderRadius }, style]}>
      {/* Dark Shadow */}
      <View
        style={[
          styles.shadow,
          {
            borderRadius,
            shadowColor: darkShadow,
            shadowOffset: { width: elevation, height: elevation },
            shadowOpacity: 1,
            shadowRadius: elevation,
            backgroundColor: theme.colors.surface,
          },
        ]}
      >
        {/* Light Shadow */}
        <View
          style={[
            styles.shadow,
            {
              borderRadius,
              shadowColor: lightShadow,
              shadowOffset: { width: -elevation / 2, height: -elevation / 2 },
              shadowOpacity: 1,
              shadowRadius: elevation,
              backgroundColor: theme.colors.surface,
            },
          ]}
        >
          <LinearGradient
            colors={[
              theme.colors.surface,
              isDark ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)',
            ]}
            style={[styles.gradient, { borderRadius }]}
          >
            {children}
          </LinearGradient>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
  },
  shadow: {
    ...Platform.select({
      ios: {
        shadowOpacity: 1,
      },
      android: {
        elevation: 4, // Android elevation is limited, so we rely on layering
      },
    }),
  },
  gradient: {
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
});
