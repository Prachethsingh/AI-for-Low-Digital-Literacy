import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { Text, TextInput, Button, IconButton, useTheme } from 'react-native-paper';
import { useAppContext } from '../context/AppContext';
import NeumorphicView from '../components/NeumorphicView';

export default function SettingsScreen({ navigation }: any) {
  const { backendUrl, setBackendUrl, language } = useAppContext();
  const theme = useTheme();
  const [url, setUrl] = useState(backendUrl);

  const handleSave = () => {
    setBackendUrl(url);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <IconButton icon="chevron-left" onPress={() => navigation.goBack()} />
        <Text variant="headlineSmall" style={{ fontWeight: 'bold' }}>
          {language === 'kannada' ? 'ಸಂಯೋಜನೆಗಳು' : 'Settings'}
        </Text>
      </View>

      <View style={styles.content}>
        <Text variant="titleMedium" style={styles.label}>
          {language === 'kannada' ? 'ಸರ್ವರ್ ವಿಳಾಸ' : 'Backend Server URL'}
        </Text>
        <NeumorphicView style={styles.inputCard}>
          <TextInput
            value={url}
            onChangeText={setUrl}
            placeholder="http://10.0.2.2:8000"
            mode="flat"
            style={{ backgroundColor: 'transparent' }}
          />
        </NeumorphicView>
        <Text variant="bodySmall" style={styles.hint}>
          {language === 'kannada' 
            ? 'ಎಮ್ಯುಲೇಟರ್‌ಗಾಗಿ 10.0.2.2 ಮತ್ತು ನೈಜ ಫೋನ್‌ಗಾಗಿ ನಿಮ್ಮ ಕಂಪ್ಯೂಟರ್ ಐಪಿಯನ್ನು ಬಳಸಿ.' 
            : 'Use 10.0.2.2 for emulator or your computer IP for real device.'}
        </Text>

        <Button 
          mode="contained" 
          onPress={handleSave} 
          style={styles.btn}
        >
          {language === 'kannada' ? 'ಉಳಿಸಿ' : 'Save & Reload'}
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', padding: 8 },
  content: { padding: 24 },
  label: { marginBottom: 12, fontWeight: 'bold' },
  inputCard: { borderRadius: 16, overflow: 'hidden' },
  hint: { marginTop: 12, opacity: 0.6, lineHeight: 18 },
  btn: { marginTop: 40, borderRadius: 16, paddingVertical: 8 },
});
