import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import { ThemedText } from '@/components/ThemedText';
import { useColorScheme } from '@/hooks/useColorScheme';
import ChessPiece from '@/components/ChessPiece';
import { useChessStore } from '@/hooks/useChessStore';

interface ChessBoardProps {
  size: number;
  position: string;
  onSquarePress: (square: string) => void;
}

const ChessBoard: React.FC<ChessBoardProps> = ({ size, position, onSquarePress }) => {
  const colorScheme = useColorScheme();
  const { selectedSquare } = useChessStore();
  const squareSize = size / 8;
  
  const lightSquareColor = colorScheme === 'dark' ? '#546E7A' : '#EEEED2';
  const darkSquareColor = colorScheme === 'dark' ? '#263238' : '#769656';
  const selectedSquareColor = colorScheme === 'dark' ? '#8ea5b3' : '#bbca6a';
  
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];

  // Parse FEN string to get piece positions
  const parseFen = (fen: string) => {
    const board: Record<string, string> = {};
    const parts = fen.split(' ');
    const rows = parts[0].split('/');
    
    rows.forEach((row, rankIndex) => {
      let fileIndex = 0;
      for (let i = 0; i < row.length; i++) {
        const char = row[i];
        if (isNaN(parseInt(char))) {
          const square = files[fileIndex] + ranks[rankIndex];
          board[square] = char;
          fileIndex++;
        } else {
          fileIndex += parseInt(char);
        }
      }
    });
    
    return board;
  };
  
  const pieces = parseFen(position);

  const renderSquare = (file: string, rank: string, index: number) => {
    const square = file + rank;
    const isLightSquare = (files.indexOf(file) + ranks.indexOf(rank)) % 2 === 1;
    const isSelected = selectedSquare === square;
    
    const backgroundColor = isSelected 
      ? selectedSquareColor 
      : isLightSquare 
        ? lightSquareColor 
        : darkSquareColor;

    return (
      <TouchableOpacity
        key={square}
        style={[
          styles.square,
          {
            width: squareSize,
            height: squareSize,
            backgroundColor
          },
        ]}
        onPress={() => onSquarePress(square)}
      >
        {pieces[square] && (
          <ChessPiece piece={pieces[square]} size={squareSize * 0.8} />
        )}
        
        {/* Square coordinates - show on corner squares */}
        {(rank === '1' || rank === '8') && (
          <ThemedText style={[
            styles.coordinate, 
            { 
              bottom: rank === '1' ? 2 : undefined, 
              top: rank === '8' ? 2 : undefined,
              left: 4,
              color: isLightSquare ? darkSquareColor : lightSquareColor,
              fontSize: squareSize * 0.2,
            }
          ]}>
            {file}
          </ThemedText>
        )}
        
        {(file === 'a' || file === 'h') && (
          <ThemedText style={[
            styles.coordinate, 
            { 
              right: file === 'h' ? 4 : undefined, 
              left: file === 'a' ? 4 : undefined,
              top: 2,
              color: isLightSquare ? darkSquareColor : lightSquareColor,
              fontSize: squareSize * 0.2,
            }
          ]}>
            {rank}
          </ThemedText>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.board, { width: size, height: size }]}>
      {ranks.map((rank, rankIndex) => (
        <View key={rank} style={styles.row}>
          {files.map((file, fileIndex) => renderSquare(file, rank, rankIndex * 8 + fileIndex))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  board: {
    flexDirection: 'column',
    borderWidth: 1,
    borderColor: '#666',
  },
  row: {
    flexDirection: 'row',
  },
  square: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  coordinate: {
    position: 'absolute',
    fontSize: 10,
    opacity: 0.8,
  },
});

export default ChessBoard;
