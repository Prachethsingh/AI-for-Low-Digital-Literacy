/**
 * VoiceRecorder – Animated big mic button for recording voice input.
 * Sends audio to backend /transcribe endpoint.
 */
import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  Alert,
  Platform,
} from 'react-native';
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
          toValue: 1.25,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 1,
          duration: 600,
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
    if (isProcessing) return;

    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      stopPulse();
      setIsProcessing(true);

      try {
        const path = await recorder.stopRecorder();
        recorder.removeRecordBackListener();

        // Send to backend
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
          // Whisper not available — use placeholder
          Alert.alert(
            'Voice unavailable',
            'Speech recognition not available on this server. Please type your query instead.',
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
      // Start recording
      try {
        await recorder.startRecorder();
        recorder.addRecordBackListener(() => {});
        setIsRecording(true);
        startPulse();

        // Auto-stop after 10 seconds
        setTimeout(() => {
          if (isRecording) handlePress();
        }, 10000);
      } catch (err: any) {
        Alert.alert('Permission denied', 'Please allow microphone access in settings.');
        onError?.(err.message);
      }
    }
  };

  const statusText = isProcessing
    ? t('processing', language)
    : isRecording
    ? t('recording', language)
    : t('tapMic', language);

  return (
    <View style={styles.container}>
      {/* Pulse ring */}
      <Animated.View
        style={[
          styles.pulseRing,
          {
            transform: [{ scale: pulse }],
            opacity: isRecording ? 0.35 : 0,
          },
        ]}
      />

      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.8}
        disabled={isProcessing}
        style={[
          styles.micButton,
          isRecording && styles.micButtonActive,
          isProcessing && styles.micButtonProcessing,
        ]}
      >
        <Text style={styles.micIcon}>
          {isProcessing ? '⏳' : isRecording ? '⏹' : '🎤'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.statusText}>{statusText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  pulseRing: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#C62828',
    top: 10,
  },
  micButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#2E7D32',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  micButtonActive: {
    backgroundColor: '#C62828',
  },
  micButtonProcessing: {
    backgroundColor: '#795548',
  },
  micIcon: {
    fontSize: 44,
  },
  statusText: {
    marginTop: 14,
    fontSize: 16,
    fontWeight: '600',
    color: '#3E2723',
    textAlign: 'center',
  },
});
