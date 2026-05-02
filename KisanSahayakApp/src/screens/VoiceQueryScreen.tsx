/**
 * VoiceQueryScreen – The AI-first interface.
 * Tap mic → Speak → Ollama processes → App speaks back.
 */
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Tts from 'react-native-tts';
import { RootStackParamList } from '../../App';
import { useAppContext } from '../context/AppContext';
import VoiceRecorder from '../components/VoiceRecorder';
import SkeletonCard from '../components/SkeletonCard';
import LanguageToggle from '../components/LanguageToggle';

type Props = NativeStackScreenProps<RootStackParamList, 'VoiceQuery'>;

interface Message {
  id: string;
  role: 'user' | 'ai';
  text: string;
}

export default function VoiceQueryScreen({ navigation }: Props) {
  const { language, backendUrl, answers } = useAppContext();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    // Initial greeting
    const greeting = language === 'kannada'
      ? 'ನಮಸ್ಕಾರ! ನೀವು ಯಾವುದೇ ಕೃಷಿ ಅಥವಾ ಸರ್ಕಾರಿ ಯೋಜನೆಯ ಬಗ್ಗೆ ಕೇಳಬಹುದು. ನಾನು ನಿಮಗೆ ಸಹಾಯ ಮಾಡುತ್ತೇನೆ.'
      : 'Hello! You can ask me about any agricultural or government scheme. How can I help you today?';

    setMessages([{ id: 'init', role: 'ai', text: greeting }]);
    speak(greeting);
  }, []);

  const speak = (text: string) => {
    Tts.stop();
    Tts.setDefaultLanguage(language === 'kannada' ? 'kn-IN' : 'en-IN');
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
    } catch (err) {
      const errorMsg = language === 'kannada'
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
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>‹ {language === 'kannada' ? 'ಹಿಂದೆ' : 'Back'}</Text>
        </TouchableOpacity>
        <LanguageToggle />
      </View>

      <ScrollView
        ref={scrollRef}
        style={styles.chatArea}
        contentContainerStyle={styles.chatContent}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map(m => (
          <View
            key={m.id}
            style={[
              styles.bubble,
              m.role === 'user' ? styles.userBubble : styles.aiBubble,
            ]}
          >
            {m.role === 'ai' && <Text style={styles.bubbleIcon}>🤖</Text>}
            <Text style={[styles.bubbleText, m.role === 'user' && styles.userText]}>
              {m.text}
            </Text>
          </View>
        ))}

        {isLoading && <SkeletonCard variant="bubble" />}
      </ScrollView>

      {/* Mic Footer */}
      <View style={styles.footer}>
        <VoiceRecorder onTranscript={handleTranscript} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F5F1E8' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#1B5E20',
  },
  backBtn: { padding: 4 },
  backText: { color: '#fff', fontSize: 17, fontWeight: '600' },
  chatArea: { flex: 1 },
  chatContent: { padding: 16, paddingBottom: 30 },
  bubble: {
    padding: 18,
    borderRadius: 24,
    marginVertical: 10,
    maxWidth: '85%',
    elevation: 2,
  },
  aiBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFDF5',
    borderBottomLeftRadius: 4,
    flexDirection: 'row',
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#2E7D32',
    borderBottomRightRadius: 4,
  },
  bubbleIcon: { fontSize: 24, marginRight: 10 },
  bubbleText: { fontSize: 17, lineHeight: 26, color: '#333' },
  userText: { color: '#fff', fontWeight: '500' },
  footer: {
    paddingBottom: 20,
    backgroundColor: '#F5F1E8',
    borderTopWidth: 1,
    borderTopColor: '#E0D8C8',
  },
});
