import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming
} from 'react-native-reanimated';
import { ThemedText } from './ThemedText';

interface StopwatchDisplayProps {
  time: number;
  isRunning: boolean;
}

const AnimatedText = Animated.createAnimatedComponent(ThemedText);

const StopwatchDisplay: React.FC<StopwatchDisplayProps> = ({ time, isRunning }) => {
  // Animation values
  const digitScale = useSharedValue(1);
  const millisecondOpacity = useSharedValue(1);
  const colonOpacity = useSharedValue(1);
  
  useEffect(() => {
    // Pulsing animation for the colon when running
    if (isRunning) {
      colonOpacity.value = withRepeat(
        withSequence(
          withTiming(0.3, { duration: 500 }),
          withTiming(1, { duration: 500 })
        ),
        -1, // Infinite repeat
        true // Reverse
      );
    } else {
      // Stop animation when not running
      colonOpacity.value = withTiming(1, { duration: 300 });
    }
    
    // Subtle scale animation when time updates
    if (time > 0 && isRunning) {
      digitScale.value = withSequence(
        withTiming(1.03, { duration: 100 }),
        withTiming(1, { duration: 200, easing: Easing.elastic(1.2) })
      );
    }
  }, [time, isRunning]);
  
  // Format milliseconds into hours, minutes, seconds, and milliseconds
  const formatTime = (timeInMs: number) => {
    const milliseconds = Math.floor((timeInMs % 1000) / 10);
    const seconds = Math.floor((timeInMs / 1000) % 60);
    const minutes = Math.floor((timeInMs / (1000 * 60)) % 60);
    const hours = Math.floor(timeInMs / (1000 * 60 * 60));

    const formattedHours = hours > 0 ? `${hours}:` : '';
    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    const formattedMilliseconds = milliseconds < 10 ? `0${milliseconds}` : `${milliseconds}`;

    return {
      hoursMinutes: `${formattedHours}${formattedMinutes}`,
      seconds: formattedSeconds,
      milliseconds: formattedMilliseconds,
    };
  };

  const { hoursMinutes, seconds, milliseconds } = formatTime(time);
  
  // Animated styles
  const digitAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: digitScale.value }]
  }));
  
  const colonAnimatedStyle = useAnimatedStyle(() => ({
    opacity: colonOpacity.value
  }));
  
  const millisecondAnimatedStyle = useAnimatedStyle(() => ({
    opacity: millisecondOpacity.value
  }));

  return (
    <View style={styles.container}>
      <View style={styles.timeContainer}>
        <Animated.View style={digitAnimatedStyle}>
          <ThemedText style={styles.timeText}>{hoursMinutes}</ThemedText>
        </Animated.View>
        
        <AnimatedText style={[styles.colonText, colonAnimatedStyle]}>:</AnimatedText>
        
        <Animated.View style={digitAnimatedStyle}>
          <ThemedText style={styles.timeText}>{seconds}</ThemedText>
        </Animated.View>
        
        <AnimatedText style={[styles.millisText, millisecondAnimatedStyle]}>.{milliseconds}</AnimatedText>
      </View>
      
      {isRunning && (
        <View style={styles.pulseCircle}>
          <Animated.View style={styles.innerPulse} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  timeText: {
    fontSize: 60,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  colonText: {
    fontSize: 60,
    fontWeight: 'bold',
  },
  millisText: {
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  pulseCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#e74c3c',
    position: 'absolute',
    top: -5,
    right: -5,
    overflow: 'visible',
  },
  innerPulse: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#e74c3c',
    position: 'absolute',
    top: 0,
    left: 0,
  }
});

export default StopwatchDisplay;