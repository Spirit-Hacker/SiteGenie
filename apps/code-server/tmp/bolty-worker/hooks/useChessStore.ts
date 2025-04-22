import { create } from 'zustand';
import { Chess, Move, Square } from 'chess.js';

interface ChessState {
  game: Chess;
  selectedSquare: string | null;
  currentPlayer: 'w' | 'b';
  gameStatus: 'active' | 'check' | 'checkmate' | 'draw';
  moves: Move[];
  resetGame: () => void;
  movePiece: (square: string) => void;
}

export const useChessStore = create<ChessState>((set, get) => ({
  game: new Chess(),
  selectedSquare: null,
  currentPlayer: 'w',
  gameStatus: 'active',
  moves: [],
  
  resetGame: () => {
    const newGame = new Chess();
    set({
      game: newGame,
      selectedSquare: null,
      currentPlayer: 'w',
      gameStatus: 'active',
      moves: []
    });
  },
  
  movePiece: (square: string) => {
    const { game, selectedSquare } = get();
    const currentState = { ...get() };
    
    // If no square is selected yet, select this one if it contains a piece of the current player
    if (selectedSquare === null) {
      const piece = game.get(square as Square);
      if (piece && piece.color === currentState.currentPlayer) {
        set({ selectedSquare: square });
      }
      return;
    }
    
    // If the same square is selected, deselect it
    if (selectedSquare === square) {
      set({ selectedSquare: null });
      return;
    }
    
    try {
      // Try to make a move from the selected square to the target square
      const moveResult = game.move({
        from: selectedSquare as Square,
        to: square as Square,
        promotion: 'q' // Always promote to queen for simplicity
      });
      
      if (moveResult) {
        // Determine game state
        let gameStatus: ChessState['gameStatus'] = 'active';
        if (game.isCheck()) gameStatus = 'check';
        if (game.isCheckmate()) gameStatus = 'checkmate';
        if (game.isDraw()) gameStatus = 'draw';
        
        // Update state with the new game state
        set({
          game: game,
          selectedSquare: null,
          currentPlayer: game.turn(),
          gameStatus,
          moves: [...currentState.moves, moveResult]
        });
      } else {
        // If the move is invalid but the square has a piece of the current player, select it
        const piece = game.get(square as Square);
        if (piece && piece.color === currentState.currentPlayer) {
          set({ selectedSquare: square });
        } else {
          set({ selectedSquare: null });
        }
      }
    } catch (e) {
      // If there's an error, deselect the square
      set({ selectedSquare: null });
    }
  }
}));
