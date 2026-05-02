/**
 * SkeletonCard – Animated placeholder cards for loading states.
 * Shows while waiting for Ollama / network response.
 */
import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Easing } from 'react-native';

interface SkeletonCardProps {
  variant?: 'scheme' | 'detail' | 'bubble';
}

export default function SkeletonCard({ variant = 'scheme' }: SkeletonCardProps) {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(shimmer, {
          toValue: 0,
          duration: 900,
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
    outputRange: [0.35, 0.7],
  });

  if (variant === 'bubble') {
    return (
      <Animated.View style={[styles.bubble, { opacity }]}>
        <View style={styles.bubbleCircle} />
        <View style={styles.bubbleLines}>
          <View style={[styles.line, { width: '70%' }]} />
          <View style={[styles.line, { width: '50%', marginTop: 8 }]} />
        </View>
      </Animated.View>
    );
  }

  if (variant === 'detail') {
    return (
      <Animated.View style={[styles.detailCard, { opacity }]}>
        <View style={styles.detailIconRow}>
          <View style={styles.detailIcon} />
          <View style={[styles.line, { flex: 1, marginLeft: 12, height: 22 }]} />
        </View>
        <View style={[styles.line, { width: '100%', marginTop: 16 }]} />
        <View style={[styles.line, { width: '85%', marginTop: 10 }]} />
        <View style={[styles.line, { width: '60%', marginTop: 10 }]} />
        <View style={styles.detailAudioBtn} />
      </Animated.View>
    );
  }

  // default: scheme card
  return (
    <Animated.View style={[styles.card, { opacity }]}>
      <View style={styles.cardIcon} />
      <View style={styles.cardText}>
        <View style={[styles.line, { width: '60%' }]} />
        <View style={[styles.line, { width: '80%', marginTop: 8 }]} />
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
    backgroundColor: '#E8E0D0',
    borderRadius: 18,
    padding: 20,
    marginHorizontal: 20,
    marginVertical: 8,
    alignItems: 'center',
  },
  cardIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#C8BEA8',
    marginRight: 16,
  },
  cardText: {
    flex: 1,
  },
  line: {
    height: 16,
    borderRadius: 8,
    backgroundColor: '#C8BEA8',
  },
  bubble: {
    flexDirection: 'row',
    backgroundColor: '#E8E0D0',
    borderRadius: 18,
    padding: 16,
    margin: 16,
    alignItems: 'center',
  },
  bubbleCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#C8BEA8',
    marginRight: 12,
  },
  bubbleLines: {
    flex: 1,
  },
  detailCard: {
    backgroundColor: '#E8E0D0',
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
    backgroundColor: '#C8BEA8',
  },
  detailAudioBtn: {
    height: 60,
    borderRadius: 14,
    backgroundColor: '#C8BEA8',
    marginTop: 24,
  },
});
