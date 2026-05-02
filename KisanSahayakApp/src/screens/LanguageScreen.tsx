import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useAppContext } from '../context/AppContext';
import Tts from 'react-native-tts';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Language'>;

const LanguageScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { setLanguage } = useAppContext();

  useEffect(() => {
    Tts.setDefaultLanguage('hi-IN');
    Tts.speak('ನಮಸ್ತೆ. ದಯವಿಟ್ಟು ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆ ಮಾಡಿ. Namaste. Please select your language.');
  }, []);

  const handleSelect = (lang: 'english' | 'kannada') => {
    setLanguage(lang);
    navigation.navigate('Welcome');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ಭಾಷೆಯನ್ನು ಆಯ್ಕೆ ಮಾಡಿ{'\n'}Select Language</Text>
      
      <TouchableOpacity style={styles.button} onPress={() => handleSelect('kannada')}>
        <Text style={styles.buttonText}>ಕನ್ನಡ (Kannada)</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={[styles.button, styles.englishButton]} onPress={() => handleSelect('english')}>
        <Text style={[styles.buttonText, styles.englishText]}>English</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F8F5',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E7D32',
    textAlign: 'center',
    marginBottom: 50,
    lineHeight: 40,
  },
  button: {
    backgroundColor: '#FF9800',
    width: '100%',
    padding: 25,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 20,
    elevation: 4,
  },
  englishButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#2E7D32',
  },
  buttonText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  englishText: {
    color: '#2E7D32',
  },
});

export default LanguageScreen;
