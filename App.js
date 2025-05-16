import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { Audio, Video } from 'expo-av';

const { width, height } = Dimensions.get('window');

const storySteps = [
  {
    type: 'text',
    content: 'You wake up to an alarm. What do you do?',
    actions: [
      { label: 'Dismiss alarm', nextStep: 1 },
      { label: 'Wake up', nextStep: 2 },
    ],
  },
  {
    type: 'gameover',
    content: 'Game Over: You missed the chem final',
  },
  {
    type: 'video',
    content: require('./assets/klondikeEasy.mp4'),
    nextStep: 3,
  },
  {
    type: 'text',
    content: 'What do you do after waking up?',
    actions: [
      { label: 'Get ready for school', nextStep: 4 },
      { label: 'Hop on the computer', nextStep: 5 },
    ],
  },
  {
    type: 'video',
    content: require('./assets/klondikeEasy.mp4'),
    nextStep: 6,
  },
  {
    type: 'gameover',
    content: 'Game Over: You played too much and missed the chem final',
  },
  {
    type: 'text',
    content: 'Where do you go?',
    actions: [
      { label: 'Go to class', nextStep: 7 },
      { label: 'Go to gas station', nextStep: 8 },
    ],
  },
  {
    type: 'video',
    content: require('./assets/klondikeEasy.mp4'),
    nextStep: 9,
  },
  {
    type: 'gameover',
    content: 'Game Over: You got locked out of school',
  },
  {
    type: 'text',
    content: 'Choose what to do next in 2nd period',
    actions: [
      { label: 'Go to 2nd period', nextStep: 10 },
      { label: 'Skip class', nextStep: 11 },
    ],
  },
  {
    type: 'video',
    content: require('./assets/klondikeEasy.mp4'),
    nextStep: 12,
  },
  {
    type: 'gameover',
    content: 'Game Over: You were marked absent',
  },
  {
    type: 'text',
    content: 'After school, what do you do?',
    actions: [
      { label: 'Do homework', nextStep: 13 },
      { label: 'Play Solitaire', nextStep: 14 },
      { label: 'Go out with friends', nextStep: 16 },
    ],
  },
  {
    type: 'text',
    content: 'Which Solitaire difficulty do you choose?',
    actions: [
      { label: 'Easy', nextStep: 15 },
      { label: 'Medium', nextStep: 15 },
      { label: 'Hard', nextStep: 15 },
      { label: 'Expert', nextStep: 15 },
    ],
  },
  {
    type: 'text',
    content: 'You play Solitaire for hours. Feeling satisfied?',
    actions: [
      { label: 'Yes, relaxed and ready for tomorrow', nextStep: 19 },
      { label: 'No, wasted too much time', nextStep: 20 },
    ],
  },
  {
    type: 'text',
    content: 'You start your homework. Do you focus well?',
    actions: [
      { label: 'Yes, focus and finish early', nextStep: 17 },
      { label: 'Get distracted by phone', nextStep: 18 },
    ],
  },
  {
    type: 'text',
    content: 'You go out with friends. What do you do?',
    actions: [
      { label: 'Grab dinner and chat', nextStep: 21 },
      { label: 'Party late and skip sleep', nextStep: 22 },
    ],
  },
  {
    type: 'text',
    content: 'You finished homework early! Want to review or relax?',
    actions: [
      { label: 'Review notes', nextStep: 23 },
      { label: 'Relax and watch a movie', nextStep: 24 },
    ],
  },
  {
    type: 'gameover',
    content: 'Game Over: You got distracted and didn’t finish homework. Bad grade tomorrow.',
  },
  {
    type: 'text',
    content: 'You feel ready and rested. Good night!',
  },
  {
    type: 'gameover',
    content: 'Game Over: You stayed up too late playing games and are exhausted tomorrow.',
  },
  {
    type: 'text',
    content: 'Dinner was fun. You head home early. Ready to sleep?',
    actions: [
      { label: 'Yes, go to bed', nextStep: 25 },
      { label: 'No, scroll social media', nextStep: 26 },
    ],
  },
  {
    type: 'gameover',
    content: 'Game Over: You partied too late and failed your chem final.',
  },
  {
    type: 'text',
    content: 'You review your notes and feel confident for tomorrow. Sleep well!',
  },
  {
    type: 'text',
    content: 'You relax and watch a movie before bed. Ready for a fresh start tomorrow!',
  },
  {
    type: 'text',
    content: 'You go to bed early and wake up refreshed. You survived the day well!',
  },
  {
    type: 'gameover',
    content: 'Game Over: You stayed up scrolling and missed the final exam.',
  },
];

export default function App() {
  const [stepIndex, setStepIndex] = useState(0);
  const [showNext, setShowNext] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef(null);

  const step = storySteps[stepIndex];

  useEffect(() => {
    const setupAudio = async () => {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        staysActiveInBackground: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      });
    };
    setupAudio();
  }, []);

  useEffect(() => {
    let timer;
    if (step.type === 'video') {
      setShowNext(false);
      timer = setTimeout(() => {
        setShowNext(true);
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [stepIndex, step.type]);

  const handleNext = () => {
    if (step?.nextStep !== undefined) {
      setStepIndex(step.nextStep);
    }
  };

  const handleAction = (nextStep) => {
    setStepIndex(nextStep);
  };

  const restart = () => {
    setStepIndex(0);
  };

  if (!step) return <Text>Loading...</Text>;

  return (
    <View style={styles.container}>
      {step.type === 'gameover' && (
        <View style={styles.textScreen}>
          <Text style={styles.text}>{step.content}</Text>
          <TouchableOpacity style={styles.button} onPress={restart}>
            <Text style={styles.buttonText}>Restart</Text>
          </TouchableOpacity>
        </View>
      )}
      {step.type === 'text' && (
        <View style={styles.textScreen}>
          <Text style={styles.text}>{step.content}</Text>
          {step.actions &&
            step.actions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={styles.button}
                onPress={() => handleAction(action.nextStep)}
              >
                <Text style={styles.buttonText}>{action.label}</Text>
              </TouchableOpacity>
            ))}
        </View>
      )}
      {step.type === 'video' && (
        <View style={styles.videoScreen}>
          <Video
            ref={videoRef}
            source={step.content}
            style={styles.video}
            resizeMode="cover"
            shouldPlay
            isMuted={isMuted}
            useNativeControls={false}
            onError={(e) => console.log('Video error:', e)}
          />
          {showNext && (
            <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
      <View style={styles.soundToggleContainer}>
        <TouchableOpacity
          onPress={() => setIsMuted(!isMuted)}
          style={styles.soundToggle}
        >
          <Text style={styles.soundText}>{isMuted ? 'Sound Off' : 'Sound On'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  textScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    fontSize: 22,
    color: '#fff',
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#1e90ff',
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    minWidth: '60%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  videoScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: width * 0.9,
    height: height * 0.6,
    borderRadius: 15,
  },
  nextButton: {
    marginTop: 20,
    backgroundColor: '#467599',
    padding: 15,
    borderRadius: 10,
  },
  soundToggleContainer: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  soundToggle: {
    backgroundColor: '#444',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  soundText: {
    color: '#fff',
  },
});