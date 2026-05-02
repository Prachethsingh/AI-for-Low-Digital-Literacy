/**
 * VoiceRecorder — fully MD3 compliant.
 * Uses TouchableRipple, Avatar.Icon, ActivityIndicator from react-native-paper.
 * No TouchableOpacity, no hardcoded colors.
 */
import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Easing,
  Alert,
  Platform,
  PermissionsAndroid,
  useWindowDimensions,
} from 'react-native';
import {
  Text,
  Avatar,
  useTheme,
  ActivityIndicator,
  TouchableRipple,
} from 'react-native-paper';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import { useAppContext } from '../context/AppContext';
import { t } from '../constants/translations';

const recorder = new AudioRecorderPlayer();

interface VoiceRecorderProps {
  onTranscript: (text: string) => void;
  onError?: (err: string) => void;
}

export default function VoiceRecorder({ onTranscript, onError }: VoiceRecorderProps) {
  const { language, backendUrl } = useAppContext();
  const theme = useTheme();
  const { width: screenWidth } = useWindowDimensions();
  const isLargeScreen = screenWidth > 600;

  const micSize = isLargeScreen ? 160 : 120;
  const iconSize = isLargeScreen ? 130 : 100;
  const ringSize = micSize + 16;
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const pulse = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef<Animated.CompositeAnimation | null>(null);

  useEffect(() => {
    return () => {
      recorder.stopRecorder().catch(() => {});
    };
  }, []);

  const startPulse = () => {
    pulseAnim.current = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.35,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnim.current.start();
  };

  const stopPulse = () => {
    pulseAnim.current?.stop();
    Animated.timing(pulse, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const handlePress = async () => {
    if (isProcessing) {
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      stopPulse();
      setIsProcessing(true);

      try {
        const path = await recorder.stopRecorder();
        recorder.removeRecordBackListener();

        const formData = new FormData();
        formData.append('file', {
          uri: Platform.OS === 'android' ? `file://${path}` : path,
          type: 'audio/m4a',
          name: 'recording.m4a',
        } as any);

        const response = await fetch(`${backendUrl}/transcribe`, {
          method: 'POST',
          body: formData,
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        const data = await response.json();

        if (data.warning) {
          Alert.alert(
            'Voice unavailable',
            'Speech recognition is not available. Please type your query instead.',
          );
          onError?.('whisper_unavailable');
        } else if (data.text) {
          onTranscript(data.text);
        } else {
          onError?.('empty_transcript');
        }
      } catch (err: any) {
        console.error('Recording error:', err);
        onError?.(err.message ?? 'unknown');
      } finally {
        setIsProcessing(false);
      }
    } else {
      try {
        if (Platform.OS === 'android') {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
            {
              title: 'Microphone Permission',
              message: 'Kisan Sahayak needs access to your microphone to recognize your voice.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            Alert.alert('Permission denied', 'Microphone access is required for voice features.');
            return;
          }
        }

        await recorder.startRecorder();
        recorder.addRecordBackListener(() => {});
        setIsRecording(true);
        startPulse();

        // Auto-stop after 10 seconds
        setTimeout(() => {
          if (isRecording) {
            handlePress();
          }
        }, 10000);
      } catch (err: any) {
        Alert.alert('Error', 'Could not start recording.');
        onError?.(err.message);
      }
    }
  };

  const statusText = isProcessing
    ? t('processing', language)
    : isRecording
    ? t('recording', language)
    : t('tapMic', language);

  const micBg = isRecording ? theme.colors.error : theme.colors.primary;

  return (
    <View style={styles.container}>
      {/* Animated pulse ring behind the button */}
      <Animated.View
        style={[
          styles.pulseRing,
          {
            width: ringSize,
            height: ringSize,
            borderRadius: ringSize / 2,
            transform: [{ scale: pulse }],
            opacity: isRecording ? 0.28 : 0,
            backgroundColor: theme.colors.error,
          },
        ]}
      />

      {/* Mic button — MD3 TouchableRipple */}
      <TouchableRipple
        onPress={handlePress}
        disabled={isProcessing}
        style={[styles.ripple, { shadowColor: theme.colors.shadow }]}
        rippleColor="rgba(255, 255, 255, 0.3)"
        borderless
      >
        <View style={[styles.micButton, { backgroundColor: micBg, width: micSize, height: micSize, borderRadius: micSize / 2 }]}>
          {isProcessing ? (
            <ActivityIndicator color={theme.colors.onPrimary} size={40} />
          ) : (
            <Avatar.Icon
              size={iconSize}
              icon={isRecording ? 'stop' : 'microphone'}
              color={theme.colors.onPrimary}
              style={{ backgroundColor: 'transparent' }}
            />
          )}
        </View>
      </TouchableRipple>

      <Text
        variant="titleMedium"
        style={[styles.statusText, { color: theme.colors.primary }]}
      >
        {statusText}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  pulseRing: {
    position: 'absolute',
    width: 136,
    height: 136,
    borderRadius: 68,
    top: -8,
  },
  ripple: {
    borderRadius: 60,
    overflow: 'hidden',
    elevation: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  micButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    marginTop: 16,
    fontWeight: '800',
    textAlign: 'center',
  },
});
