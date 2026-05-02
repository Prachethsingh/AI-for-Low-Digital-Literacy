import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppProvider } from './src/context/AppContext';

// New Hackathon Screens
import LanguageScreen from './src/screens/LanguageScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';
import QuestionScreen from './src/screens/QuestionScreen';
import SuccessScreen from './src/screens/SuccessScreen';

export type RootStackParamList = {
  Language: undefined;
  Welcome: undefined;
  Question: { flowId: string; step: number };
  Success: { messageEn: string; messageKn: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function App(): JSX.Element {
  return (
    <AppProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Language"
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
            contentStyle: { backgroundColor: '#F0F8F5' },
          }}>
          <Stack.Screen name="Language" component={LanguageScreen} />
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Question" component={QuestionScreen} />
          <Stack.Screen name="Success" component={SuccessScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
}

export default App;
