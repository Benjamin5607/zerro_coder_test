import React, { useState, useEffect } from 'react';
import './Board.css';

interface Piece {
  type: string;
  x: number;
  y: number;
  color: string;
}

const TetrisBoard = () => {
  const [board, setBoard] = useState<Array<Array<string>>>([]);
  const [piece, setPiece] = useState<Piece | null>(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const initializeBoard = () => {
      const newBoard: Array<Array<string>> = [];
      for (let i = 0; i < 20; i++) {
        newBoard.push([]);
        for (let j = 0; j < 10; j++) {
          newBoard[i].push('empty');
        }
      }
      setBoard(newBoard);
    };
    initializeBoard();
  }, []);

  const handleKeyPress = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowLeft':
        movePiece(-1, 0);
        break;
      case 'ArrowRight':
        movePiece(1, 0);
        break;
      case 'ArrowDown':
        movePiece(0, 1);
        break;
      case 'ArrowUp':
        rotatePiece();
        break;
      default:
        break;
    }
  };

  const movePiece = (dx: number, dy: number) => {
    if (!piece) return;
    const newX = piece.x + dx;
    const newY = piece.y + dy;
    if (newX < 0 || newX >= 10 || newY < 0 || newY >= 20) return;
    setPiece({ ...piece, x: newX, y: newY });
  };

  const rotatePiece = () => {
    if (!piece) return;
    // rotation logic
  };

  const dropPiece = () => {
    if (!piece) return;
    const newY = piece.y + 1;
    if (newY >= 20) {
      // game over
      return;
    }
    setPiece({ ...piece, y: newY });
  };

  const createPiece = () => {
    const types = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
    const randomType = types[Math.floor(Math.random() * types.length)];
    const piece: Piece = {
      type: randomType,
      x: 5,
      y: 0,
      color: 'red',
    };
    setPiece(piece);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      dropPiece();
    }, 1000);
    return () => clearInterval(intervalId);
  }, [piece]);

  return (
    <div className="board" onKeyPress={handleKeyPress} tabIndex={0}>
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {row.map((cell, cellIndex) => (
            <div
              key={cellIndex}
              className={`cell ${cell === 'empty' ? '' : 'filled'}`}
            ></div>
          ))}
        </div>
      ))}
      {piece && (
        <div
          className={`piece ${piece.type}`}
          style={{
            left: `${piece.x * 30}px`,
            top: `${piece.y * 30}px`,
          }}
        ></div>
      )}
    </div>
  );
};

export default TetrisBoard;