import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { Platform, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
  Easing,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming
} from 'react-native-reanimated';
import LapTimes from '../components/LapTimes';
import StopwatchDisplay from '../components/StopwatchDisplay';
import { ThemedText } from '../components/ThemedText';
import { ThemedView } from '../components/ThemedView';
import { useThemeColor } from '../hooks/useThemeColor';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function StopwatchScreen() {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [laps, setLaps] = useState<number[]>([]);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const lapStartTimeRef = useRef<number>(0);
  
  const buttonColor = useThemeColor({}, 'tint');
  const secondaryColor = useThemeColor({ light: '#ccc', dark: '#444' }, 'icon');
  const textColor = useThemeColor({}, 'text');
  const bgColor = useThemeColor({}, 'background');
  
  // Animation values
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(20);
  const displayScale = useSharedValue(0.8);
  const startButtonScale = useSharedValue(1);
  const resetButtonOpacity = useSharedValue(0.5);
  const lapButtonOpacity = useSharedValue(0.5);
  const controlsTranslateY = useSharedValue(50);
  
  useEffect(() => {
    // Initial animations
    titleOpacity.value = withTiming(1, { duration: 800 });
    titleTranslateY.value = withTiming(0, { duration: 800 });
    displayScale.value = withSpring(1, { damping: 12 });
    controlsTranslateY.value = withTiming(0, { duration: 600, easing: Easing.out(Easing.cubic) });
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
  
  useEffect(() => {
    if (time > 0 || isRunning) {
      resetButtonOpacity.value = withTiming(1, { duration: 300 });
    } else {
      resetButtonOpacity.value = withTiming(0.5, { duration: 300 });
    }
    
    if (isRunning) {
      lapButtonOpacity.value = withTiming(1, { duration: 300 });
    } else {
      lapButtonOpacity.value = withTiming(0.5, { duration: 300 });
    }
  }, [time, isRunning]);
  
  const startStopwatch = () => {
    // Button press animation
    startButtonScale.value = withSequence(
      withTiming(0.9, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );
    
    if (isRunning) {
      // Stop the stopwatch
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    } else {
      // Start the stopwatch
      const startTime = Date.now() - time;
      startTimeRef.current = startTime;
      
      if (laps.length === 0) {
        lapStartTimeRef.current = startTime;
      }
      
      intervalRef.current = setInterval(() => {
        const elapsedTime = Date.now() - startTimeRef.current;
        setTime(elapsedTime);
      }, 10);
    }
    
    setIsRunning(!isRunning);
  };
  
  const resetStopwatch = () => {
    if (time === 0 && !isRunning) return;
    
    // Button press animation
    resetButtonOpacity.value = withSequence(
      withTiming(0.6, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    // Reset animation
    displayScale.value = withSequence(
      withTiming(0.95, { duration: 150 }),
      withTiming(1, { duration: 300, easing: Easing.elastic(1.5) })
    );
    
    setTime(0);
    setLaps([]);
    setIsRunning(false);
    startTimeRef.current = 0;
    lapStartTimeRef.current = 0;
  };
  
  const recordLap = () => {
    if (!isRunning) return;
    
    // Button press animation
    lapButtonOpacity.value = withSequence(
      withTiming(0.6, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );
    
    // Lap record animation
    displayScale.value = withSequence(
      withTiming(0.97, { duration: 100 }),
      withTiming(1, { duration: 200, easing: Easing.elastic(1.2) })
    );
    
    const lapTime = Date.now() - lapStartTimeRef.current;
    lapStartTimeRef.current = Date.now();
    setLaps((prevLaps) => [lapTime, ...prevLaps]);
  };
  
  // Animated styles
  const titleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }]
  }));
  
  const displayAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: displayScale.value }]
  }));
  
  const startButtonAnimatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      isRunning ? 1 : 0,
      [0, 1],
      ['#2ecc71', '#e74c3c']
    );
    
    return {
      backgroundColor,
      transform: [{ scale: startButtonScale.value }]
    };
  });
  
  const resetButtonAnimatedStyle = useAnimatedStyle(() => ({
    opacity: resetButtonOpacity.value,
    backgroundColor: buttonColor
  }));
  
  const lapButtonAnimatedStyle = useAnimatedStyle(() => ({
    opacity: lapButtonOpacity.value,
    backgroundColor: buttonColor
  }));
  
  const controlsAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: controlsTranslateY.value }]
  }));
  
  return (
    <ThemedView style={styles.container}>
      <StatusBar style="auto" />
      <Animated.View style={[styles.titleContainer, titleAnimatedStyle]}>
        <ThemedText type="title">Stopwatch</ThemedText>
      </Animated.View>
      
      <Animated.View style={[styles.displayContainer, displayAnimatedStyle]}>
        <StopwatchDisplay time={time} isRunning={isRunning} />
      </Animated.View>
      
      <Animated.View style={[styles.buttonsContainer, controlsAnimatedStyle]}>
        <AnimatedTouchable 
          style={[styles.button, resetButtonAnimatedStyle]} 
          onPress={resetStopwatch}
          disabled={time === 0 && !isRunning}
        >
          <ThemedText style={styles.buttonText}>
            Reset
          </ThemedText>
        </AnimatedTouchable>
        
        <AnimatedTouchable 
          style={[styles.button, styles.mainButton, startButtonAnimatedStyle]} 
          onPress={startStopwatch}
        >
          <ThemedText style={styles.buttonText}>
            {isRunning ? "Stop" : "Start"}
          </ThemedText>
        </AnimatedTouchable>
        
        <AnimatedTouchable 
          style={[styles.button, lapButtonAnimatedStyle]} 
          onPress={recordLap}
          disabled={!isRunning}
        >
          <ThemedText style={styles.buttonText}>
            Lap
          </ThemedText>
        </AnimatedTouchable>
      </Animated.View>
      
      <LapTimes laps={laps} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  displayContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  button: {
    padding: 15,
    borderRadius: 50,
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  mainButton: {
    width: 90,
    height: 90,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});