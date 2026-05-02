/**
 * QuestionScreen — guided flow Q&A with camera capture.
 * MD3: Card, Button, IconButton, ProgressBar, Avatar, Surface.
 * No hardcoded hex. Camera screen uses theme.colors.inverseSurface.
 */
import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Platform,
  PermissionsAndroid,
  useWindowDimensions,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  Text,
  IconButton,
  Button,
  Card,
  ProgressBar,
  useTheme,
  Surface,
  Avatar,
} from 'react-native-paper';
import { RootStackParamList } from '../../App';
import { useAppContext } from '../context/AppContext';
import { FLOWS } from '../constants/flows';
import Tts from 'react-native-tts';
import { launchCamera } from 'react-native-image-picker';
import VoiceRecorder from '../components/VoiceRecorder';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Question'>;
type RouteType = RouteProp<RootStackParamList, 'Question'>;

export default function QuestionScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteType>();
  const { flowId, step } = route.params;
  const { language } = useAppContext();
  const theme = useTheme();

  const flow = FLOWS[flowId];
  const question = flow.questions[step];
  const isKan = language === 'kannada';
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const isLargeScreen = screenWidth > 600;

  const robotSize = isLargeScreen ? 120 : 80;
  const frameMargin = isLargeScreen ? 80 : 40;

  const [photoUri, setPhotoUri] = useState<string | null>(null);

  const questionText = isKan ? question.textKn : question.textEn;
  const progress = (step + 1) / flow.questions.length;

  useEffect(() => {
    Tts.setDefaultLanguage('hi-IN');
    Tts.speak(questionText);
  }, [questionText]);

  const handleNext = () => {
    if (step < flow.questions.length - 1) {
      navigation.replace('Question', { flowId, step: step + 1 });
    } else {
      navigation.navigate('Success', {
        messageEn: 'Your application is complete!',
        messageKn: 'ನಿಮ್ಮ ಅರ್ಜಿ ಪೂರ್ಣಗೊಂಡಿದೆ!',
      });
    }
  };

  const handleOptionSelect = (optionId: string) => {
    if (question.type === 'camera' && optionId === 'yes') {
      openCamera();
    } else {
      handleNext();
    }
  };

  const openCamera = async () => {
    const prompt = isKan ? question.cameraPromptKn : question.cameraPromptEn;
    if (prompt) {
      Tts.speak(prompt);
    }
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'Kisan Sahayak needs access to your camera to scan documents.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert('Permission denied', 'Camera access is required to capture photos.');
          return;
        }
      }

      const result = await launchCamera({
        mediaType: 'photo',
        cameraType: 'back',
        quality: 0.5,
      });
      if (result.assets && result.assets.length > 0) {
        setPhotoUri(result.assets[0].uri || null);
        setTimeout(() => handleNext(), 1500);
      }
    } catch {
      handleNext();
    }
  };

  const renderYesNo = () => (
    <View style={styles.yesNoContainer}>
      {question.options?.map(opt => {
        const isYes = opt.id === 'yes';
        return (
          <View key={opt.id} style={styles.yesNoWrapper}>
            <IconButton
              icon={isYes ? 'thumb-up' : 'thumb-down'}
              mode="contained"
              containerColor={
                isYes
                  ? theme.colors.primaryContainer
                  : theme.colors.errorContainer
              }
              iconColor={
                isYes ? theme.colors.onPrimaryContainer : theme.colors.onErrorContainer
              }
              size={64}
              onPress={() => handleOptionSelect(opt.id)}
            />
            <Text
              variant="titleMedium"
              style={[styles.yesNoText, { color: theme.colors.onSurface }]}
            >
              {isKan ? opt.labelKn : opt.labelEn}
            </Text>
          </View>
        );
      })}
    </View>
  );

  const renderMultiple = () => (
    <View style={styles.multipleContainer}>
      {question.options?.map(opt => {
        if (opt.id === 'download' || opt.id === 'submit' || opt.id === 'both') {
          return (
            <Button
              key={opt.id}
              mode={opt.id === 'both' ? 'outlined' : 'contained'}
              onPress={() => handleOptionSelect(opt.id)}
              style={styles.actionButton}
              contentStyle={styles.actionButtonContent}
            >
              {isKan ? opt.labelKn : opt.labelEn}
            </Button>
          );
        }
        return (
          <Card
            key={opt.id}
            style={styles.multipleButton}
            onPress={() => handleOptionSelect(opt.id)}
            mode="outlined"
          >
            <Card.Content style={styles.multipleContent}>
              {opt.icon && (
                <Text style={styles.multipleIcon}>{opt.icon}</Text>
              )}
              <Text
                variant="titleLarge"
                style={[styles.multipleText, { color: theme.colors.onSurface }]}
              >
                {isKan ? opt.labelKn : opt.labelEn}
              </Text>
            </Card.Content>
          </Card>
        );
      })}
    </View>
  );

  // Camera capture screen
  if (question.type === 'camera' && !photoUri) {
    return (
      <View style={[styles.cameraScreen, { backgroundColor: theme.colors.inverseSurface }]}>
        <View style={styles.cameraHeader}>
          <IconButton
            icon="chevron-left"
            iconColor={theme.colors.inverseOnSurface}
            size={32}
            onPress={() => navigation.goBack()}
          />
        </View>
        <Text
          variant="headlineSmall"
          style={[styles.cameraTitle, { color: theme.colors.inverseOnSurface }]}
        >
          {questionText}
        </Text>

        <View style={[styles.cameraFrame, { borderColor: theme.colors.primary, margin: frameMargin }]} />

        <View style={styles.cameraFooter}>
          <IconButton
            icon="circle-outline"
            iconColor={theme.colors.inverseOnSurface}
            size={80}
            onPress={openCamera}
            style={styles.captureButton}
          />
          <Text
            variant="bodyMedium"
            style={[styles.captureText, { color: theme.colors.inverseOnSurface }]}
          >
            {isKan ? 'ಸೆರೆಹಿಡಿಯಲು ವೃತ್ತವನ್ನು ಟ್ಯಾಪ್ ಮಾಡಿ' : 'Tap the circle to capture'}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <View style={styles.container}>
        {/* Progress header */}
        <View style={styles.header}>
          <IconButton
            icon="chevron-left"
            size={28}
            onPress={() => navigation.goBack()}
          />
          <View style={styles.progressContainer}>
            <ProgressBar
              progress={progress}
              color={theme.colors.primary}
              style={styles.progressBar}
            />
            <Text
              variant="labelSmall"
              style={[styles.progressText, { color: theme.colors.onSurfaceVariant }]}
            >
              {isKan
                ? `ಹಂತ ${step + 1} / ${flow.questions.length}`
                : `Step ${step + 1} of ${flow.questions.length}`}
            </Text>
          </View>
        </View>

        {/* AI robot indicator */}
        <View style={styles.robotContainer}>
          <Avatar.Icon
            size={robotSize}
            icon="robot"
            style={{ backgroundColor: theme.colors.primaryContainer }}
            color={theme.colors.onPrimaryContainer}
          />
          <Text
            variant="labelLarge"
            style={[styles.speakingLabel, { color: theme.colors.primary }]}
          >
            {isKan ? 'ಮಾತನಾಡುತ್ತಿದ್ದೇನೆ...' : 'Speaking...'}
          </Text>
        </View>

        {/* Question text */}
        <Text
          variant="headlineMedium"
          style={[styles.questionText, { color: theme.colors.onBackground }]}
        >
          {questionText}
        </Text>

        <ScrollView
          contentContainerStyle={styles.optionsScroll}
          showsVerticalScrollIndicator={false}
        >
          {question.type === 'yesno' && renderYesNo()}
          {question.type === 'multiple' && renderMultiple()}

          {photoUri && (
            <Card style={styles.previewCard}>
              <Card.Cover source={{ uri: photoUri }} />
              <Card.Title
                title={isKan ? 'ದಾಖಲೆ ಸೆರೆಹಿಡಿಯಲಾಗಿದೆ' : 'Document Captured'}
              />
            </Card>
          )}
        </ScrollView>

        {/* Voice recorder footer */}
        <Surface
          style={[styles.micFooter, { backgroundColor: theme.colors.background }]}
          elevation={0}
        >
          <VoiceRecorder
            onTranscript={() => {
              if (question.options) {
                handleOptionSelect(question.options[0].id);
              } else {
                handleNext();
              }
            }}
          />
        </Surface>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 16 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  progressContainer: {
    flex: 1,
    marginRight: 40,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
  },
  progressText: {
    textAlign: 'center',
    marginTop: 4,
  },
  robotContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  speakingLabel: {
    marginTop: 8,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  questionText: {
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 32,
  },
  optionsScroll: { paddingBottom: 40 },
  yesNoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
  },
  yesNoWrapper: { alignItems: 'center' },
  yesNoText: {
    marginTop: 8,
    fontWeight: 'bold',
  },
  multipleContainer: { width: '100%' },
  multipleButton: {
    marginBottom: 12,
    borderRadius: 16,
  },
  multipleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  multipleIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  multipleText: { fontWeight: '600' },
  actionButton: {
    width: '100%',
    marginBottom: 12,
    borderRadius: 12,
  },
  actionButtonContent: { paddingVertical: 12 },
  cameraScreen: { flex: 1 },
  cameraHeader: {
    marginTop: 40,
    paddingHorizontal: 8,
  },
  cameraTitle: {
    textAlign: 'center',
    paddingHorizontal: 32,
    marginTop: 16,
  },
  cameraFrame: {
    flex: 1,
    borderWidth: 2,
    borderRadius: 24,
    borderStyle: 'dashed',
  },
  cameraFooter: {
    alignItems: 'center',
    paddingBottom: 48,
  },
  captureButton: { margin: 0 },
  captureText: {
    marginTop: 8,
    opacity: 0.8,
  },
  previewCard: {
    marginTop: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  micFooter: {
    alignItems: 'center',
    paddingVertical: 16,
  },
});
