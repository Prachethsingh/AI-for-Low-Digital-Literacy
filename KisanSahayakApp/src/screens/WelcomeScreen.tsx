import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useAppContext } from '../context/AppContext';
import { FLOWS } from '../constants/flows';
import Tts from 'react-native-tts';
import VoiceRecorder from '../components/VoiceRecorder';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Welcome'>;

const WelcomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { language, setLanguage } = useAppContext();

  const isKan = language === 'kannada';
  const greeting = isKan ? 'ನಮಸ್ತೆ!' : 'Namaste!';
  const subGreeting = isKan ? 'ನಾನು ನಿಮಗೆ ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಲ್ಲೆ?' : 'How can I help you?';

  useEffect(() => {
    Tts.setDefaultLanguage('hi-IN');
    Tts.speak(`${greeting} ${subGreeting}`);
  }, [greeting, subGreeting]);

  const handleSelect = (flowId: string) => {
    navigation.navigate('Question', { flowId, step: 0 });
  };

  const toggleLanguage = () => {
    setLanguage(isKan ? 'english' : 'kannada');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.menuIcon}>
            <Text style={{ fontSize: 24 }}>☰</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.langToggle} onPress={toggleLanguage}>
            <Text style={styles.langText}>{isKan ? 'En' : 'ಕನ್ನಡ'}</Text>
          </TouchableOpacity>
        </View>

        {/* Greeting */}
        <View style={styles.greetingContainer}>
          <Text style={styles.greetingTitle}>{greeting} <Text style={{ fontSize: 32 }}>👋</Text></Text>
          <Text style={styles.greetingSub}>{subGreeting}</Text>
        </View>

        {/* Big Mic Area */}
        <View style={styles.micContainer}>
          {/* Using the VoiceRecorder from before which has the pulse animation */}
          <VoiceRecorder 
            onTranscript={(text) => {
              // Basic intent matching for demo
              const t = text.toLowerCase();
              if (t.includes('kisan') || t.includes('samman') || t.includes('money')) {
                handleSelect('pm_kisan');
              } else if (t.includes('bima') || t.includes('insurance') || t.includes('crop')) {
                handleSelect('pmfby');
              }
            }} 
          />
        </View>

        {/* Options List */}
        <Text style={styles.iWantToText}>{isKan ? 'ನನಗೆ ಬೇಕಾಗಿರುವುದು...' : 'I want to...'}</Text>
        
        <ScrollView contentContainerStyle={styles.scroll}>
          {Object.values(FLOWS).map((flow) => (
            <TouchableOpacity 
              key={flow.id} 
              style={styles.card}
              onPress={() => handleSelect(flow.id)}
            >
              <View style={styles.cardContent}>
                <Text style={styles.icon}>{flow.icon}</Text>
                <Text style={styles.title}>
                  {isKan ? flow.titleKn : flow.titleEn}
                </Text>
              </View>
              <Text style={styles.arrowIcon}>›</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>✨ Powered by AI Assistant</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F7FDF9',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  menuIcon: {
    padding: 10,
  },
  langToggle: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFF',
  },
  langText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  greetingContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  greetingTitle: {
    fontSize: 36,
    fontWeight: '900',
    color: '#111',
    marginBottom: 5,
  },
  greetingSub: {
    fontSize: 18,
    color: '#555',
    fontWeight: '500',
  },
  micContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    height: 180,
  },
  iWantToText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#666',
    marginBottom: 15,
    marginLeft: 5,
  },
  scroll: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    fontSize: 32,
    marginRight: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#222',
    flexShrink: 1,
  },
  arrowIcon: {
    fontSize: 28,
    color: '#999',
    marginLeft: 10,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 15,
  },
  footerText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
});

export default WelcomeScreen;
