/**
 * SkeletonCard — shimmer loading placeholder.
 * Fully MD3: uses theme surface/surfaceVariant tokens, no hardcoded hex.
 */
import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Easing } from 'react-native';
import { useTheme } from 'react-native-paper';

interface SkeletonCardProps {
  variant?: 'scheme' | 'detail' | 'bubble';
}

export default function SkeletonCard({ variant = 'scheme' }: SkeletonCardProps) {
  const theme = useTheme();
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(shimmer, {
          toValue: 0,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [shimmer]);

  const opacity = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 0.85],
  });

  // Use theme tokens instead of hardcoded hex
  const skeletonBg = theme.colors.surfaceVariant;
  const shimmerBg = theme.colors.surfaceVariant;

  if (variant === 'bubble') {
    return (
      <Animated.View
        style={[
          styles.bubble,
          { opacity, backgroundColor: theme.colors.surfaceVariant },
        ]}
      >
        <View style={[styles.bubbleCircle, { backgroundColor: skeletonBg }]} />
        <View style={styles.bubbleLines}>
          <View style={[styles.line, { width: '70%', backgroundColor: skeletonBg }]} />
          <View
            style={[
              styles.line,
              { width: '50%', marginTop: 8, backgroundColor: skeletonBg },
            ]}
          />
        </View>
      </Animated.View>
    );
  }

  if (variant === 'detail') {
    return (
      <Animated.View
        style={[
          styles.detailCard,
          { opacity, backgroundColor: theme.colors.surfaceVariant },
        ]}
      >
        <View style={styles.detailIconRow}>
          <View style={[styles.detailIcon, { backgroundColor: shimmerBg }]} />
          <View
            style={[
              styles.line,
              { flex: 1, marginLeft: 12, height: 22, backgroundColor: shimmerBg },
            ]}
          />
        </View>
        <View style={[styles.line, { width: '100%', marginTop: 16, backgroundColor: shimmerBg }]} />
        <View style={[styles.line, { width: '85%', marginTop: 10, backgroundColor: shimmerBg }]} />
        <View style={[styles.line, { width: '60%', marginTop: 10, backgroundColor: shimmerBg }]} />
        <View style={[styles.detailAudioBtn, { backgroundColor: shimmerBg }]} />
      </Animated.View>
    );
  }

  // Default: scheme card row
  return (
    <Animated.View
      style={[styles.card, { opacity, backgroundColor: theme.colors.surface }]}
    >
      <View style={[styles.cardIcon, { backgroundColor: skeletonBg }]} />
      <View style={styles.cardText}>
        <View style={[styles.line, { width: '60%', backgroundColor: skeletonBg }]} />
        <View
          style={[
            styles.line,
            { width: '80%', marginTop: 8, backgroundColor: skeletonBg },
          ]}
        />
      </View>
    </Animated.View>
  );
}

export function SkeletonList({ count = 4 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} variant="scheme" />
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 20,
    padding: 16,
    marginHorizontal: 20,
    marginVertical: 8,
    alignItems: 'center',
    elevation: 1,
  },
  cardIcon: {
    width: 60,
    height: 60,
    borderRadius: 16,
    marginRight: 16,
  },
  cardText: {
    flex: 1,
  },
  line: {
    height: 16,
    borderRadius: 8,
  },
  bubble: {
    flexDirection: 'row',
    borderRadius: 24,
    padding: 16,
    margin: 16,
    alignItems: 'center',
  },
  bubbleCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  bubbleLines: {
    flex: 1,
  },
  detailCard: {
    borderRadius: 24,
    padding: 24,
    margin: 16,
  },
  detailIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  detailAudioBtn: {
    height: 60,
    borderRadius: 14,
    marginTop: 24,
  },
});
