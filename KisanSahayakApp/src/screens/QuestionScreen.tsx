import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, SafeAreaView } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useAppContext } from '../context/AppContext';
import { FLOWS } from '../constants/flows';
import Tts from 'react-native-tts';
import { launchCamera } from 'react-native-image-picker';
import VoiceRecorder from '../components/VoiceRecorder';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Question'>;
type RouteType = RouteProp<RootStackParamList, 'Question'>;

const QuestionScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteType>();
  const { flowId, step } = route.params;
  const { language } = useAppContext();
  
  const flow = FLOWS[flowId];
  const question = flow.questions[step];
  const isKan = language === 'kannada';
  
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  const questionText = isKan ? question.textKn : question.textEn;

  useEffect(() => {
    Tts.setDefaultLanguage('hi-IN');
    Tts.speak(questionText);
  }, [questionText]);

  const handleNext = () => {
    if (step < flow.questions.length - 1) {
      navigation.replace('Question', { flowId, step: step + 1 });
    } else {
      const msgEn = `Your application is complete!`;
      const msgKn = `ನಿಮ್ಮ ಅರ್ಜಿ ಪೂರ್ಣಗೊಂಡಿದೆ!`;
      navigation.navigate('Success', { messageEn: msgEn, messageKn: msgKn });
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
    if (prompt) Tts.speak(prompt);
    
    try {
      const result = await launchCamera({
        mediaType: 'photo',
        cameraType: 'back',
        quality: 0.5,
      });
      
      if (result.assets && result.assets.length > 0) {
        setPhotoUri(result.assets[0].uri || null);
        setTimeout(() => handleNext(), 1500);
      }
    } catch (err) {
      console.log('Camera error', err);
      handleNext();
    }
  };

  // Render Yes/No Options
  const renderYesNo = () => (
    <View style={styles.yesNoContainer}>
      {question.options?.map((opt) => {
        const isYes = opt.id === 'yes';
        return (
          <TouchableOpacity 
            key={opt.id} 
            style={[styles.yesNoButton, isYes ? styles.yesButton : styles.noButton]}
            onPress={() => handleOptionSelect(opt.id)}
          >
            <Text style={styles.yesNoIcon}>{isYes ? '👍' : '👎'}</Text>
            <Text style={styles.yesNoText}>{isKan ? opt.labelKn : opt.labelEn}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  // Render Multiple Choice Options
  const renderMultiple = () => (
    <View style={styles.multipleContainer}>
      {question.options?.map((opt) => {
        // Special styling for final step
        if (opt.id === 'download' || opt.id === 'submit' || opt.id === 'both') {
          return (
            <TouchableOpacity 
              key={opt.id} 
              style={[
                styles.actionButton, 
                opt.id === 'download' && {backgroundColor: '#4CAF50'},
                opt.id === 'submit' && {backgroundColor: '#2196F3'},
                opt.id === 'both' && {backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#CCC'}
              ]}
              onPress={() => handleOptionSelect(opt.id)}
            >
              <Text style={[
                styles.actionButtonText,
                opt.id === 'both' && {color: '#333'}
              ]}>
                {isKan ? opt.labelKn : opt.labelEn}
              </Text>
            </TouchableOpacity>
          );
        }

        return (
          <TouchableOpacity 
            key={opt.id} 
            style={styles.multipleButton}
            onPress={() => handleOptionSelect(opt.id)}
          >
            {opt.icon && <Text style={styles.multipleIcon}>{opt.icon}</Text>}
            <Text style={styles.multipleText}>{isKan ? opt.labelKn : opt.labelEn}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  // Render Camera View Placeholder
  if (question.type === 'camera' && !photoUri) {
    return (
      <View style={styles.cameraScreen}>
        <View style={styles.cameraHeader}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backIconDark}>‹</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.cameraTitle}>{questionText}</Text>
        
        <View style={styles.cameraFrame}>
          {/* Simulated Scanner Frame */}
        </View>

        <TouchableOpacity style={styles.captureButton} onPress={openCamera}>
          <View style={styles.captureInner} />
        </TouchableOpacity>
        <Text style={styles.captureText}>{isKan ? 'ಸೆರೆಹಿಡಿಯಲು ವೃತ್ತವನ್ನು ಟ್ಯಾಪ್ ಮಾಡಿ' : 'Tap the circle to capture'}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
        </View>

        {/* AI Robot */}
        <View style={styles.robotContainer}>
          <View style={styles.robotCircle}>
            <Text style={styles.robotIcon}>🤖</Text>
          </View>
          <Text style={styles.waveAnim}>ılılıllı</Text>
        </View>

        {/* Question Text */}
        <Text style={styles.questionText}>{questionText}</Text>

        <ScrollView contentContainerStyle={styles.optionsScroll}>
          {question.type === 'yesno' && renderYesNo()}
          {question.type === 'multiple' && renderMultiple()}
          
          {photoUri && (
             <Image source={{ uri: photoUri }} style={styles.previewImage} />
          )}
        </ScrollView>

        <View style={styles.micFooter}>
          <VoiceRecorder 
            onTranscript={(text) => {
              if (question.options) {
                handleOptionSelect(question.options[0].id); // Auto-advance for hackathon demo
              } else {
                handleNext();
              }
            }} 
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  header: {
    marginBottom: 20,
  },
  backIcon: {
    fontSize: 40,
    color: '#333',
    lineHeight: 40,
  },
  backIconDark: {
    fontSize: 40,
    color: '#FFF',
    lineHeight: 40,
    padding: 20,
  },
  robotContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  robotCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F0F8F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  robotIcon: {
    fontSize: 40,
  },
  waveAnim: {
    fontSize: 24,
    color: '#FF9800',
    letterSpacing: 2,
  },
  questionText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#111',
    textAlign: 'center',
    marginBottom: 40,
  },
  optionsScroll: {
    paddingBottom: 40,
    alignItems: 'center',
  },
  
  /* Yes / No Styles */
  yesNoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 30,
    width: '100%',
  },
  yesNoButton: {
    alignItems: 'center',
  },
  yesNoIcon: {
    fontSize: 60,
    marginBottom: 10,
  },
  yesNoText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  yesButton: {
    // optional specific style
  },
  noButton: {
    // optional specific style
  },

  /* Multiple Choice Styles */
  multipleContainer: {
    width: '100%',
  },
  multipleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
    padding: 20,
    borderRadius: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#EAEAEA',
  },
  multipleIcon: {
    fontSize: 32,
    marginRight: 20,
  },
  multipleText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#222',
  },

  /* Action Buttons (Submit/Download) */
  actionButton: {
    width: '100%',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
  },
  actionButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },

  /* Camera Fullscreen Styles */
  cameraScreen: {
    flex: 1,
    backgroundColor: '#111',
    paddingTop: 40,
  },
  cameraHeader: {
    flexDirection: 'row',
  },
  cameraTitle: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
  cameraFrame: {
    flex: 1,
    margin: 40,
    borderWidth: 2,
    borderColor: '#FF9800',
    borderRadius: 20,
    borderStyle: 'dashed',
  },
  captureButton: {
    alignSelf: 'center',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'transparent',
    borderWidth: 4,
    borderColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  captureInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFF',
  },
  captureText: {
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 40,
    fontSize: 16,
  },
  
  previewImage: {
    width: '100%',
    height: 300,
    borderRadius: 16,
    marginTop: 20,
  },
  micFooter: {
    alignItems: 'center',
    paddingVertical: 10,
  }
});

export default QuestionScreen;
