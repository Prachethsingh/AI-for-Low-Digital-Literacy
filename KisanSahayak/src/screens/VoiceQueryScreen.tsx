/**
 * VoiceQueryScreen — AI chat interface with voice input.
 * MD3: Appbar, Avatar, Surface, ActivityIndicator, Text. No hardcoded hex.
 */
import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import {
  Text,
  useTheme,
  Appbar,
  Avatar,
  Surface,
  ActivityIndicator,
} from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Tts from 'react-native-tts';
import { RootStackParamList } from '../../App';
import { useAppContext } from '../context/AppContext';
import VoiceRecorder from '../components/VoiceRecorder';

type Props = NativeStackScreenProps<RootStackParamList, 'VoiceQuery'>;

interface Message {
  id: string;
  role: 'user' | 'ai';
  text: string;
}

export default function VoiceQueryScreen({ navigation }: Props) {
  const { language, backendUrl, answers } = useAppContext();
  const theme = useTheme();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const isKan = language === 'kannada';

  useEffect(() => {
    const greeting = isKan
      ? 'ನಮಸ್ಕಾರ! ನೀವು ಯಾವುದೇ ಕೃಷಿ ಅಥವಾ ಸರ್ಕಾರಿ ಯೋಜನೆಯ ಬಗ್ಗೆ ಕೇಳಬಹುದು.'
      : 'Hello! You can ask me about any agricultural or government scheme.';
    setMessages([{ id: 'init', role: 'ai', text: greeting }]);
    speak(greeting);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const speak = (text: string) => {
    Tts.stop();
    Tts.setDefaultLanguage(isKan ? 'kn-IN' : 'en-IN');
    Tts.speak(text);
  };

  const handleTranscript = async (text: string) => {
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await fetch(`${backendUrl}/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: text,
          user_profile: {
            is_farmer: answers.is_farmer,
            has_aadhaar: answers.has_aadhaar,
            is_woman: answers.is_woman,
          },
          language,
        }),
      });

      const data = await response.json();
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: data.answer,
      };
      setMessages(prev => [...prev, aiMsg]);
      speak(data.answer);
    } catch {
      const errorMsg = isKan
        ? 'ಕ್ಷಮಿಸಿ, ಸರ್ವರ್‌ಗೆ ಸಂಪರ್ಕಿಸಲು ಸಾಧ್ಯವಾಗುತ್ತಿಲ್ಲ.'
        : 'Sorry, I could not connect to the server.';
      setMessages(prev => [...prev, { id: 'err', role: 'ai', text: errorMsg }]);
      speak(errorMsg);
    } finally {
      setIsLoading(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 200);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header style={{ backgroundColor: theme.colors.primary }}>
        <Appbar.BackAction
          onPress={() => navigation.goBack()}
          color={theme.colors.onPrimary}
        />
        <Appbar.Content
          title={isKan ? 'ಕಿಸಾನ್ ಸಹಾಯ' : 'Kisan Help'}
          titleStyle={[styles.headerTitle, { color: theme.colors.onPrimary }]}
        />
      </Appbar.Header>

      <ScrollView
        ref={scrollRef}
        style={styles.chatArea}
        contentContainerStyle={styles.chatContent}
        onContentSizeChange={() =>
          scrollRef.current?.scrollToEnd({ animated: true })
        }
      >
        {messages.map(m => (
          <View
            key={m.id}
            style={[
              styles.bubble,
              m.role === 'user'
                ? [styles.userBubble, { backgroundColor: theme.colors.primary }]
                : [styles.aiBubble, { backgroundColor: theme.colors.surface }],
            ]}
          >
            {m.role === 'ai' && (
              <Avatar.Icon
                size={32}
                icon="robot"
                style={{
                  marginRight: 8,
                  backgroundColor: theme.colors.primaryContainer,
                }}
                color={theme.colors.onPrimaryContainer}
              />
            )}
            <View style={{ flex: 1 }}>
              <Text
                variant="bodyLarge"
                style={[
                  styles.bubbleText,
                  {
                    color:
                      m.role === 'user'
                        ? theme.colors.onPrimary
                        : theme.colors.onSurface,
                  },
                  m.role === 'user' && { fontWeight: '700' },
                ]}
              >
                {m.text}
              </Text>
            </View>
          </View>
        ))}

        {isLoading && (
          <View
            style={[
              styles.bubble,
              styles.aiBubble,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            <ActivityIndicator size="small" color={theme.colors.primary} />
            <Text
              variant="bodyMedium"
              style={[
                { marginLeft: 8 },
                { color: theme.colors.onSurfaceVariant },
              ]}
            >
              {isKan ? 'ಯೋಚಿಸುತ್ತಿದ್ದೇನೆ…' : 'Thinking…'}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Mic footer */}
      <Surface
        style={[styles.footer, { backgroundColor: theme.colors.surface }]}
        elevation={4}
      >
        <VoiceRecorder onTranscript={handleTranscript} />
      </Surface>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  headerTitle: { fontWeight: '800' },
  chatArea: { flex: 1 },
  chatContent: { padding: 16, paddingBottom: 32 },
  bubble: {
    padding: 16,
    borderRadius: 24,
    marginVertical: 8,
    maxWidth: '90%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    elevation: 1,
  },
  aiBubble: {
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  userBubble: {
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  bubbleText: { lineHeight: 24 },
  footer: {
    paddingBottom: 24,
    paddingTop: 16,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
});
