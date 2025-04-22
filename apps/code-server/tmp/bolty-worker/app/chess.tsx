import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Alert } from 'react-native';
import ChessBoard from 'react-native-chess-board';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Stack } from 'expo-router';

export default function ChessScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const [game, setGame] = useState<any>(null);
  const [currentPlayer, setCurrentPlayer] = useState<'w' | 'b'>('w');
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [selectedPiece, setSelectedPiece] = useState<string | null>(null);

  // Handle move
  const handleMove = (move: { from: string; to: string; promotion?: string }) => {
    if (!game) return;
    
    try {
      // Make the move in the chess.js instance
      const result = game.move(move);
      
      if (result) {
        // Update move history
        setMoveHistory([...moveHistory, `${currentPlayer === 'w' ? 'White' : 'Black'}: ${result.san}`]);
        
        // Switch player
        setCurrentPlayer(currentPlayer === 'w' ? 'b' : 'w');
        
        // Check for checkmate or stalemate
        if (game.in_checkmate()) {
          Alert.alert(
            "Checkmate!",
            `${currentPlayer === 'w' ? 'White' : 'Black'} wins!`,
            [{ text: "New Game", onPress: resetGame }]
          );
        } else if (game.in_draw()) {
          Alert.alert(
            "Draw!",
            "The game is a draw!",
            [{ text: "New Game", onPress: resetGame }]
          );
        } else if (game.in_stalemate()) {
          Alert.alert(
            "Stalemate!",
            "The game is a draw due to stalemate!",
            [{ text: "New Game", onPress: resetGame }]
          );
        } else if (game.in_check()) {
          Alert.alert("Check!", `${currentPlayer === 'w' ? 'White' : 'Black'} is in check!`);
        }
      }
    } catch (error) {
      console.error("Invalid move:", error);
    }
  };

  const resetGame = () => {
    if (game) {
      game.reset();
      setCurrentPlayer('w');
      setMoveHistory([]);
      setSelectedPiece(null);
    }
  };

  useEffect(() => {
    // We need to import chess.js dynamically since it's not a React Native compatible module by default
    const loadChess = async () => {
      try {
        // Using dynamic import to load chess.js
        const Chess = require('react-native-chess-board/chess.js').Chess;
        setGame(new Chess());
      } catch (error) {
        console.error("Failed to load chess library:", error);
      }
    };
    
    loadChess();
  }, []);

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: "Chess Game" }} />
      
      <ThemedText type="defaultSemiBold" style={styles.turnIndicator}>
        {currentPlayer === 'w' ? "White's turn" : "Black's turn"}
      </ThemedText>
      
      <View style={styles.boardContainer}>
        <ChessBoard
          boardSize={350}
          boardColor={colorScheme === 'dark' ? '#8B8B8B' : '#E6E6FA'}
          darkSquareColor={colorScheme === 'dark' ? '#4F4F4F' : '#769656'}
          lightSquareColor={colorScheme === 'dark' ? '#AFAFAF' : '#EEEED2'}
          showNotation={true}
          onMove={handleMove}
          fen={game ? game.fen() : 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'}
        />
      </View>
      
      <TouchableOpacity 
        style={[styles.resetButton, {backgroundColor: colorScheme === 'dark' ? '#555' : '#0a7ea4'}]} 
        onPress={resetGame}
      >
        <ThemedText style={styles.resetButtonText}>New Game</ThemedText>
      </TouchableOpacity>
      
      <View style={styles.moveHistoryContainer}>
        <ThemedText type="subtitle" style={styles.moveHistoryTitle}>Move History</ThemedText>
        <View style={styles.moveList}>
          {moveHistory.map((move, index) => (
            <ThemedText key={index} style={styles.moveItem}>{move}</ThemedText>
          ))}
          {moveHistory.length === 0 && (
            <ThemedText style={styles.noMovesText}>No moves yet</ThemedText>
          )}
        </View>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
  },
  turnIndicator: {
    marginTop: 20,
    marginBottom: 10,
    fontSize: 18,
  },
  boardContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  resetButton: {
    padding: 10,
    borderRadius: 5,
    marginVertical: 15,
    width: '80%',
    alignItems: 'center',
  },
  resetButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  moveHistoryContainer: {
    width: '90%',
    maxHeight: 150,
    marginTop: 10,
  },
  moveHistoryTitle: {
    marginBottom: 5,
  },
  moveList: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(200, 200, 200, 0.2)',
  },
  moveItem: {
    marginBottom: 3,
  },
  noMovesText: {
    fontStyle: 'italic',
    opacity: 0.7,
  },
});
