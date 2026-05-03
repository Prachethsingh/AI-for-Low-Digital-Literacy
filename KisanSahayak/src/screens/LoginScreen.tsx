import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {
  Text,
  Button,
  TextInput,
  useTheme,
  Avatar,
} from 'react-native-paper';
import { useAppContext } from '../context/AppContext';
import NeumorphicView from '../components/NeumorphicView';

export default function LoginScreen() {
  const { setUserProfile, language } = useAppContext();
  const theme = useTheme();
  const isKan = language === 'kannada';

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [aadhaar, setAadhaar] = useState('');
  const [pan, setPan] = useState('');

  const handleLogin = () => {
    if (name && phone) {
      setUserProfile({ name, phone, aadhaar, pan });
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.header}>
            <Avatar.Icon 
              size={100} 
              icon="account-circle" 
              style={{ backgroundColor: theme.colors.primaryContainer }} 
              color={theme.colors.onPrimaryContainer}
            />
            <Text variant="headlineMedium" style={styles.title}>
              {isKan ? 'ಕಿಸಾನ್ ಲಾಗಿನ್' : 'Kisan Login'}
            </Text>
            <Text variant="bodyLarge" style={{ color: theme.colors.onSurfaceVariant }}>
              {isKan ? 'ನಿಮ್ಮ ವಿವರಗಳನ್ನು ನಮೂದಿಸಿ' : 'Enter your details to continue'}
            </Text>
          </View>

          <View style={styles.form}>
            <NeumorphicView style={styles.inputContainer}>
              <TextInput
                label={isKan ? 'ಹೆಸರು' : 'Full Name'}
                value={name}
                onChangeText={setName}
                mode="flat"
                style={styles.input}
                left={<TextInput.Icon icon="account" />}
              />
            </NeumorphicView>

            <NeumorphicView style={styles.inputContainer}>
              <TextInput
                label={isKan ? 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ' : 'Phone Number'}
                value={phone}
                onChangeText={setPhone}
                mode="flat"
                keyboardType="phone-pad"
                style={styles.input}
                left={<TextInput.Icon icon="phone" />}
              />
            </NeumorphicView>

            <NeumorphicView style={styles.inputContainer}>
              <TextInput
                label={isKan ? 'ಆಧಾರ್ ಸಂಖ್ಯೆ (ಐಚ್ಛಿಕ)' : 'Aadhaar Number (Optional)'}
                value={aadhaar}
                onChangeText={setAadhaar}
                mode="flat"
                keyboardType="numeric"
                maxLength={12}
                style={styles.input}
                left={<TextInput.Icon icon="card-account-details" />}
              />
            </NeumorphicView>

            <NeumorphicView style={styles.inputContainer}>
              <TextInput
                label={isKan ? 'ಪಾನ್ ಕಾರ್ಡ್ (ಐಚ್ಛಿಕ)' : 'PAN Card (Optional)'}
                value={pan}
                onChangeText={setPan}
                mode="flat"
                autoCapitalize="characters"
                maxLength={10}
                style={styles.input}
                left={<TextInput.Icon icon="card-text" />}
              />
            </NeumorphicView>

            <Button
              mode="contained"
              onPress={handleLogin}
              style={styles.loginBtn}
              contentStyle={styles.loginBtnContent}
              disabled={!name || !phone}
            >
              {isKan ? 'ಪ್ರವೇಶಿಸಿ' : 'Login'}
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { padding: 24, paddingBottom: 60 },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  title: {
    fontWeight: '900',
    marginTop: 16,
    marginBottom: 4,
  },
  form: {
    gap: 20,
  },
  inputContainer: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  input: {
    backgroundColor: 'transparent',
  },
  loginBtn: {
    marginTop: 20,
    borderRadius: 16,
  },
  loginBtnContent: {
    paddingVertical: 12,
  },
});
