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
  IconButton,
} from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import Animated, { FadeInUp, Layout } from 'react-native-reanimated';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AudioController } from '../utils/AudioController';
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
  const { language, backendUrl, answers, chatHistory, addChatMessage, clearChatHistory } = useAppContext();
  const theme = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const isKan = language === 'kannada';

  useEffect(() => {
    if (chatHistory.length === 0) {
      const greeting = isKan
        ? 'ನಮಸ್ಕಾರ! ನೀವು ಯಾವುದೇ ಕೃಷಿ ಅಥವಾ ಸರ್ಕಾರಿ ಯೋಜನೆಯ ಬಗ್ಗೆ ಕೇಳಬಹುದು.'
        : 'Hello! You can ask me about any agricultural or government scheme.';
      addChatMessage({ role: 'assistant', content: greeting });
      speak(greeting);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const speak = (text: string) => {
    AudioController.speak(text, language);
  };

    const userMsg: ChatMessage = { role: 'user', content: text };
    addChatMessage(userMsg);
    setIsLoading(true);

    try {
      const response = await fetch(`${backendUrl}/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: text,
          history: chatHistory.slice(-6), // Send last 6 messages for context
          user_profile: {
            is_farmer: answers.is_farmer,
            has_aadhaar: answers.has_aadhaar,
            is_woman: answers.is_woman,
          },
          language,
        }),
      });

      const data = await response.json();
      const aiMsg: ChatMessage = {
        role: 'assistant',
        content: data.answer,
      };
      addChatMessage(aiMsg);
      speak(data.answer);
    } catch {
      const errorMsg = isKan
        ? 'ಕ್ಷಮಿಸಿ, ಸರ್ವರ್‌ಗೆ ಸಂಪರ್ಕಿಸಲು ಸಾಧ್ಯವಾಗುತ್ತಿಲ್ಲ.'
        : 'Sorry, I could not connect to the server.';
      addChatMessage({ role: 'assistant', content: errorMsg });
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
        <Appbar.Action icon="delete-sweep" color={theme.colors.onPrimary} onPress={clearChatHistory} />
      </Appbar.Header>

      <ScrollView
        ref={scrollRef}
        style={styles.chatArea}
        contentContainerStyle={styles.chatContent}
        onContentSizeChange={() =>
          scrollRef.current?.scrollToEnd({ animated: true })
        }
      >
        {chatHistory.map((m, idx) => (
          <Animated.View
            key={idx}
            entering={FadeInUp.delay(idx * 100)}
            layout={Layout.springify()}
            style={[
              styles.bubbleContainer,
              m.role === 'user' ? styles.userContainer : styles.aiContainer,
            ]}
          >
            {m.role === 'assistant' && (
              <Avatar.Icon
                size={36}
                icon="robot"
                style={[styles.aiAvatar, { backgroundColor: theme.colors.primaryContainer }]}
                color={theme.colors.onPrimaryContainer}
              />
            )}
            
            <LinearGradient
              colors={
                m.role === 'user'
                  ? [theme.colors.primary, theme.colors.primary]
                  : [theme.colors.surface, theme.colors.surfaceVariant]
              }
              style={[
                styles.bubble,
                m.role === 'user' ? styles.userBubble : styles.aiBubble,
              ]}
            >
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
                ]}
              >
                {m.content}
              </Text>
            </LinearGradient>
          </Animated.View>
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
  chatContent: { padding: 16, paddingBottom: 40 },
  bubbleContainer: {
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  userContainer: {
    justifyContent: 'flex-end',
  },
  aiContainer: {
    justifyContent: 'flex-start',
  },
  aiAvatar: {
    marginRight: 8,
    marginBottom: 4,
  },
  bubble: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    maxWidth: '80%',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  aiBubble: {
    borderBottomLeftRadius: 4,
  },
  userBubble: {
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
