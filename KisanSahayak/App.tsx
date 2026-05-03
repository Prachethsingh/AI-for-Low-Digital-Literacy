/**
 * App.tsx — root of Kisan Sahayak.
 * MD3 theme via react-native-paper PaperProvider + MD3LightTheme.
 * Agricultural green palette. All screens registered.
 */
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PaperProvider, MD3LightTheme, adaptNavigationTheme } from 'react-native-paper';
import { DefaultTheme } from '@react-navigation/native';
import { AppProvider } from './src/context/AppContext';

import LanguageScreen from './src/screens/LanguageScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';
import QuestionScreen from './src/screens/QuestionScreen';
import SuccessScreen from './src/screens/SuccessScreen';
import HomeScreen from './src/screens/HomeScreen';
import CategoryScreen from './src/screens/CategoryScreen';
import EligibilityScreen from './src/screens/EligibilityScreen';
import SchemeListScreen from './src/screens/SchemeListScreen';
import SchemeDetailScreen from './src/screens/SchemeDetailScreen';
import VoiceQueryScreen from './src/screens/VoiceQueryScreen';
import LoginScreen from './src/screens/LoginScreen';
import DocumentVaultScreen from './src/screens/DocumentVaultScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import SchemeDetailScreen from './src/screens/SchemeDetailScreen';
import { useAppContext } from './src/context/AppContext';

export type RootStackParamList = {
  Language: undefined;
  Welcome: undefined;
  Question: { flowId: string; step: number };
  Success: { messageEn: string; messageKn: string };
  Home: undefined;
  Category: undefined;
  Eligibility: { category: string };
  SchemeList: { schemeIds: string[] };
  SchemeDetail: { schemeId: string };
  VoiceQuery: undefined;
  Login: undefined;
  DocumentVault: undefined;
  Settings: undefined;
  SchemeDetail: { schemeId: string };
};

// ── MD3 theme: agricultural green palette ────────────────────────────────────
const paperTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#2E7D32',          // Forest green
    onPrimary: '#FFFFFF',
    primaryContainer: '#C8E6C9', // Light green container
    onPrimaryContainer: '#1B5E20',
    secondary: '#558B2F',        // Olive green
    onSecondary: '#FFFFFF',
    secondaryContainer: '#DCEDC8',
    onSecondaryContainer: '#33691E',
    tertiary: '#1B5E20',         // Deep forest for Yes buttons
    onTertiary: '#FFFFFF',
    tertiaryContainer: '#A5D6A7',
    onTertiaryContainer: '#1B5E20',
    error: '#B71C1C',
    onError: '#FFFFFF',
    errorContainer: '#FFCDD2',
    onErrorContainer: '#B71C1C',
    background: '#F1F8E9',       // Pale leaf background
    onBackground: '#1A1A1A',
    surface: '#FFFFFF',
    onSurface: '#1A1A1A',
    surfaceVariant: '#E8F5E9',
    onSurfaceVariant: '#4A4A4A',
    inverseSurface: '#1A1A1A',
    inverseOnSurface: '#F1F8E9',
    shadow: '#000000',
  },
};

// Sync react-navigation header colors with Paper theme
const { LightTheme: navTheme } = adaptNavigationTheme({
  reactNavigationLight: DefaultTheme,
});

const Stack = createNativeStackNavigator<RootStackParamList>();

function NavigationStack() {
  const { isLoggedIn } = useAppContext();

  return (
    <Stack.Navigator
      initialRouteName={isLoggedIn ? "Home" : "Language"}
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: paperTheme.colors.background },
      }}
    >
      {!isLoggedIn ? (
        <>
          <Stack.Screen name="Language" component={LanguageScreen} />
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Category" component={CategoryScreen} />
          <Stack.Screen name="Eligibility" component={EligibilityScreen} />
          <Stack.Screen name="SchemeList" component={SchemeListScreen} />
          <Stack.Screen name="SchemeDetail" component={SchemeDetailScreen} />
          <Stack.Screen name="VoiceQuery" component={VoiceQueryScreen} />
          <Stack.Screen name="Question" component={QuestionScreen} />
          <Stack.Screen name="Success" component={SuccessScreen} />
          <Stack.Screen name="DocumentVault" component={DocumentVaultScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="SchemeDetail" component={SchemeDetailScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App(): React.JSX.Element {
  return (
    <AppProvider>
      <PaperProvider theme={paperTheme}>
        <NavigationContainer theme={navTheme}>
          <NavigationStack />
        </NavigationContainer>
      </PaperProvider>
    </AppProvider>
  );
}
