import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withSequence,
    withTiming
} from 'react-native-reanimated';

interface AnimatedPulseProps {
  color?: string;
  size?: number;
  delay?: number;
  duration?: number;
}

const AnimatedPulse: React.FC<AnimatedPulseProps> = ({
  color = '#e74c3c',
  size = 8,
  delay = 0,
  duration = 2000,
}) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.7);

  useEffect(() => {
    scale.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1.8, { duration: duration * 0.8 }),
          withTiming(1, { duration: duration * 0.2 })
        ),
        -1, // Infinite repeat
        false // Don't reverse
      )
    );

    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(0.7, { duration: 0 }),
          withTiming(0, { duration: duration * 0.8 })
        ),
        -1, // Infinite repeat
        false // Don't reverse
      )
    );
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <View style={[styles.dot, { backgroundColor: color, width: size, height: size, borderRadius: size / 2 }]} />
      <Animated.View
        style={[
          styles.pulse,
          pulseStyle,
          {
            backgroundColor: color,
            width: size,
            height: size,
            borderRadius: size / 2,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    position: 'absolute',
  },
  pulse: {
    position: 'absolute',
  },
});

export default AnimatedPulse;