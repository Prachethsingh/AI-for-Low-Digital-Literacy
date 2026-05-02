import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useAppContext } from '../context/AppContext';
import Tts from 'react-native-tts';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Success'>;
type RouteType = RouteProp<RootStackParamList, 'Success'>;

const SuccessScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteType>();
  const { messageEn, messageKn } = route.params;
  const { language } = useAppContext();

  const message = language === 'kannada' ? messageKn : messageEn;

  useEffect(() => {
    Tts.setDefaultLanguage('hi-IN');
    Tts.speak(message);
  }, [message]);

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>✅</Text>
      <Text style={styles.message}>{message}</Text>
      
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('Language')}
      >
        <Text style={styles.buttonText}>
          {language === 'kannada' ? 'ಮುಖಪುಟಕ್ಕೆ ಹಿಂತಿರುಗಿ' : 'Back to Home'}
        </Text>
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
  icon: {
    fontSize: 100,
    marginBottom: 40,
  },
  message: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2E7D32',
    textAlign: 'center',
    marginBottom: 60,
    lineHeight: 45,
  },
  button: {
    backgroundColor: '#FF9800',
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderRadius: 30,
    elevation: 5,
  },
  buttonText: {
    fontSize: 24,
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default SuccessScreen;
