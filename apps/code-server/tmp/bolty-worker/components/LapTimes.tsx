import React, { useMemo } from 'react';
import { Dimensions, FlatList, StyleSheet, View } from 'react-native';
import Animated, {
  FadeIn,
  SlideInRight,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';
import { useThemeColor } from '../hooks/useThemeColor';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

interface LapTimesProps {
  laps: number[];
}

const { width } = Dimensions.get('window');

const LapTimes: React.FC<LapTimesProps> = ({ laps }) => {
  const borderColor = useThemeColor({ light: '#eee', dark: '#333' }, 'background');
  const listOpacity = useSharedValue(0);
  const listTranslateY = useSharedValue(20);

  // Process laps to find fastest and slowest
  const processedLaps = useMemo(() => {
    if (laps.length <= 1) return laps.map(lap => ({ time: lap, status: 'normal' }));
    
    // Find fastest and slowest laps
    let fastestLapTime = Math.min(...laps);
    let slowestLapTime = Math.max(...laps);
    
    return laps.map(lap => ({
      time: lap,
      status: lap === fastestLapTime ? 'fastest' : lap === slowestLapTime ? 'slowest' : 'normal'
    }));
  }, [laps]);

  // Animate the list when laps change
  React.useEffect(() => {
    if (laps.length > 0) {
      listOpacity.value = withTiming(1, { duration: 500 });
      listTranslateY.value = withTiming(0, { duration: 500 });
    } else {
      listOpacity.value = 0;
      listTranslateY.value = 20;
    }
  }, [laps.length]);

  // Format milliseconds to display as "m:ss.ms"
  const formatLapTime = (timeInMs: number) => {
    const milliseconds = Math.floor((timeInMs % 1000) / 10);
    const seconds = Math.floor((timeInMs / 1000) % 60);
    const minutes = Math.floor((timeInMs / (1000 * 60)) % 60);

    const formattedMinutes = minutes > 0 ? `${minutes}:` : '';
    const formattedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    const formattedMilliseconds = milliseconds < 10 ? `0${milliseconds}` : `${milliseconds}`;

    return `${formattedMinutes}${formattedSeconds}.${formattedMilliseconds}`;
  };

  if (laps.length === 0) {
    return null;
  }

  const animatedListStyle = useAnimatedStyle(() => ({
    opacity: listOpacity.value,
    transform: [{ translateY: listTranslateY.value }]
  }));

  const renderLapItem = ({ item, index }: { item: { time: number, status: string }, index: number }) => {
    let textColor;
    let badgeColor;
    
    if (item.status === 'fastest') {
      textColor = '#2ecc71'; // Green for fastest
      badgeColor = 'rgba(46, 204, 113, 0.2)';
    } else if (item.status === 'slowest') {
      textColor = '#e74c3c'; // Red for slowest
      badgeColor = 'rgba(231, 76, 60, 0.2)';
    }

    // Add a staggered enter animation for each item
    const enteringAnimation = SlideInRight.delay(index * 50).springify();

    return (
      <Animated.View 
        entering={enteringAnimation}
        style={[styles.lapRow, { borderColor }]}
      >
        <View style={styles.lapNumberContainer}>
          <ThemedText style={styles.lapNumber}>Lap {laps.length - index}</ThemedText>
          {item.status !== 'normal' && (
            <View style={[styles.lapBadge, { backgroundColor: badgeColor }]}>
              <ThemedText style={[styles.lapBadgeText, { color: textColor }]}>
                {item.status === 'fastest' ? 'Fastest' : 'Slowest'}
              </ThemedText>
            </View>
          )}
        </View>
        <ThemedText style={[styles.lapTime, textColor ? { color: textColor } : undefined]}>
          {formatLapTime(item.time)}
        </ThemedText>
      </Animated.View>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <Animated.View 
        entering={FadeIn.duration(500)} 
        style={styles.headerContainer}
      >
        <ThemedText style={styles.lapsTitle}>Lap Times</ThemedText>
        <View style={styles.lapCountBadge}>
          <ThemedText style={styles.lapCountText}>{laps.length}</ThemedText>
        </View>
      </Animated.View>
      
      <Animated.View style={[styles.listContainer, animatedListStyle]}>
        <FlatList
          data={processedLaps}
          renderItem={renderLapItem}
          keyExtractor={(_, index) => index.toString()}
          style={styles.lapsList}
          contentContainerStyle={styles.lapsContent}
          showsVerticalScrollIndicator={false}
        />
      </Animated.View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  lapsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  lapCountBadge: {
    backgroundColor: '#0a7ea4',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginLeft: 10,
  },
  lapCountText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  listContainer: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  lapsList: {
    flex: 1,
  },
  lapsContent: {
    paddingBottom: 20,
  },
  lapRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    paddingHorizontal: 15,
    marginHorizontal: 5,
  },
  lapNumberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lapNumber: {
    fontSize: 16,
    fontWeight: '500',
  },
  lapBadge: {
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginLeft: 10,
  },
  lapBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  lapTime: {
    fontSize: 18,
    fontWeight: '600',
  },
});

export default LapTimes;