import React from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

interface ChessPieceProps {
  piece: string;
  size: number;
}

const ChessPiece: React.FC<ChessPieceProps> = ({ piece, size }) => {
  const getPiecePathAndColor = (piece: string) => {
    const isWhite = piece === piece.toUpperCase();
    const pieceType = piece.toLowerCase();
    let path = '';
    
    switch (pieceType) {
      case 'p': // pawn
        path = "M22 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38-1.95 1.12-3.28 3.21-3.28 5.62 0 2.03.94 3.84 2.41 5H7.09c1.47-1.16 2.41-2.97 2.41-5 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4 0-2.21 1.79-4 4-4s4 1.79 4 4c0 .89-.29 1.71-.78 2.38 1.95 1.12 3.28 3.21 3.28 5.62 0 .28-.03.55-.07.81 1.86-1.04 4.12-1.04 5.98 0-.04-.26-.07-.53-.07-.81 0-2.41 1.33-4.5 3.28-5.62C21.71 10.71 21.42 9.89 21.42 9c0-2.21 1.79-4 4-4s4 1.79 4 4c0 2.21-1.79 4-4 4z";
        break;
      case 'n': // knight
        path = "M19 22H5v-2h14v2M13 2V1h-2v1h2m4.7 13.1c.4.4.7.8.7 1.4 0 1.1-.9 2-2 2H7c-1.1 0-2-.9-2-2 0-.6.3-1 .7-1.4-.1-.2-.1-.4 0-.6.1-.2.3-.3.5-.3h2c.2 0 .4.1.5.3.1.2.1.4 0 .6.4.4.7.8.7 1.4 0 .5-.2 1-.6 1.4h7.4c-.4-.4-.6-.9-.6-1.4 0-.6.3-1 .7-1.4-.1-.2-.1-.4 0-.6.1-.2.3-.3.5-.3h2c.2 0 .4.1.5.3.1.2.1.4 0 .6M6 10V8c0-1.1.9-2 2-2h3.8v-.1L7.2 3.3l.7-.7 4.6 2.6h.9l4.6-2.6.7.7-4.6 2.6V6H16c1.1 0 2 .9 2 2v2H6z";
        break;
      case 'b': // bishop
        path = "M8 16L4 20v1h16v-1l-4-4h-8m10.5-4A.5.5 0 0 1 18 12.5V11h-4.75l2-2h-2.5l-2-2h5.75c.28 0 .5-.22.5-.5V5c0-.28-.22-.5-.5-.5h-1.83a2.992 2.992 0 0 0-4.66-2.35 3.471 3.471 0 0 0-4.17 2.35H5.5c-.28 0-.5.22-.5.5v1.5c0 .28.22.5.5.5H11l-2 2H6.5l2 2H4v1.5a.5.5 0 0 0 .5.5h14z";
        break;
      case 'r': // rook
        path = "M5 20h14v2H5v-2M17 2v3H7V2h10m-1 4.5V8H8V6.5h8m-10 2h14V10H6V8.5m2 2h8v3H8v-3m-2 7h12v-3H6v3z";
        break;
      case 'q': // queen
        path = "M12 2l-2.42 8.4c.38.4 1.14.8 2.42.8 1.28 0 2.04-.4 2.42-.8L12 2M6.38 11.62c-.36.38-.38.86-.38 1.38 0 .28-.12.36-.17.55L3 17h18l-2.83-3.45c-.05-.19-.17-.27-.17-.55 0-.52-.02-1-.38-1.38-.4-.42-1.14-.43-1.62-.43-1.56 0-2-.46-2-.46s-.44.46-2 .46c-.48 0-1.21 0-1.62.43M5 19h14v3H5v-3z";
        break;
      case 'k': // king
        path = "M19 22H5v-2h14v2M12 2c-1.1 0-2 .9-2 2v6h4V4c0-1.1-.9-2-2-2m0 10a2 2 0 1 0 0 4c1.11 0 2-.89 2-2a2 2 0 0 0-2-2m-7 0a2 2 0 1 0 0 4c1.11 0 2-.89 2-2a2 2 0 0 0-2-2m14 0a2 2 0 1 0 0 4c1.11 0 2-.89 2-2a2 2 0 0 0-2-2z";
        break;
      default:
        path = "";
    }
    
    return { path, fillColor: isWhite ? 'white' : 'black', strokeColor: isWhite ? 'black' : 'white' };
  };

  const { path, fillColor, strokeColor } = getPiecePathAndColor(piece);

  if (!path) return null;

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d={path}
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth={0.5}
      />
    </Svg>
  );
};

export default ChessPiece;
