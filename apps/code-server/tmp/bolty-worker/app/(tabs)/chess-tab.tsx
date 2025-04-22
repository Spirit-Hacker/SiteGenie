import { Link } from 'expo-router';
import { StyleSheet, Image } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function ChessTabScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <IconSymbol
          size={260}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Chess Game</ThemedText>
      </ThemedView>
      <ThemedText>
        Welcome to the chess game! Play a classic game of chess against a friend on the same device.
      </ThemedText>
      
      <ThemedView style={styles.featureContainer}>
        <ThemedText type="subtitle">Features</ThemedText>
        <ThemedText>• Full two-player chess functionality</ThemedText>
        <ThemedText>• Legal move validation</ThemedText>
        <ThemedText>• Check and checkmate detection</ThemedText>
        <ThemedText>• Piece promotion to queen</ThemedText>
        <ThemedText>• Game state tracking</ThemedText>
      </ThemedView>
      
      <ThemedView style={styles.buttonContainer}>
        <Link href="/chess" asChild>
          <ThemedView style={styles.button}>
            <ThemedText style={styles.buttonText}>Start Playing</ThemedText>
          </ThemedView>
        </Link>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -50,
    left: -20,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 15,
  },
  featureContainer: {
    marginTop: 20,
    marginBottom: 30,
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#0a7ea4',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
