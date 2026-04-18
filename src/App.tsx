import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, ArrowDown } from 'lucide-react';

const App = () => {
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [board, setBoard] = useState([]);
  const [currentPiece, setCurrentPiece] = useState(null);
  const [nextPiece, setNextPiece] = useState(null);

  const pieces = [
    {
      type: 'I',
      shape: [
        [1, 1, 1, 1]
      ]
    },
    {
      type: 'J',
      shape: [
        [1, 0, 0],
        [1, 1, 1]
      ]
    },
    {
      type: 'L',
      shape: [
        [0, 0, 1],
        [1, 1, 1]
      ]
    },
    {
      type: 'O',
      shape: [
        [1, 1],
        [1, 1]
      ]
    },
    {
      type: 'S',
      shape: [
        [0, 1, 1],
        [1, 1, 0]
      ]
    },
    {
      type: 'T',
      shape: [
        [0, 1, 0],
        [1, 1, 1]
      ]
    },
    {
      type: 'Z',
      shape: [
        [1, 1, 0],
        [0, 1, 1]
      ]
    }
  ];

  const createBoard = () => {
    const board = [];
    for (let i = 0; i < 20; i++) {
      board.push([]);
      for (let j = 0; j < 10; j++) {
        board[i].push(0);
      }
    }
    return board;
  };

  const spawnPiece = () => {
    const randomIndex = Math.floor(Math.random() * pieces.length);
    const piece = pieces[randomIndex];
    const nextPiece = pieces[(randomIndex + 1) % pieces.length];
    setCurrentPiece(piece);
    setNextPiece(nextPiece);
  };

  const movePiece = (direction) => {
    if (gameOver) return;
    const newBoard = [...board];
    const piece = currentPiece;
    const pieceX = 5;
    const pieceY = 0;
    let newX = pieceX;
    let newY = pieceY;
    switch (direction) {
      case 'left':
        newX -= 1;
        break;
      case 'right':
        newX += 1;
        break;
      case 'down':
        newY += 1;
        break;
      default:
        return;
    }
    for (let i = 0; i < piece.shape.length; i++) {
      for (let j = 0; j < piece.shape[i].length; j++) {
        if (piece.shape[i][j] === 1) {
          if (newX + j < 0 || newX + j >= 10 || newY + i >= 20) {
            return;
          }
          if (newBoard[newY + i][newX + j] === 1) {
            return;
          }
        }
      }
    }
    for (let i = 0; i < piece.shape.length; i++) {
      for (let j = 0; j < piece.shape[i].length; j++) {
        if (piece.shape[i][j] === 1) {
          newBoard[newY + i][newX + j] = 1;
        }
      }
    }
    setBoard(newBoard);
  };

  const rotatePiece = () => {
    if (gameOver) return;
    const newBoard = [...board];
    const piece = currentPiece;
    const rotatedPiece = {
      type: piece.type,
      shape: []
    };
    for (let i = 0; i < piece.shape[0].length; i++) {
      rotatedPiece.shape.push([]);
      for (let j = piece.shape.length - 1; j >= 0; j--) {
        rotatedPiece.shape[i].push(piece.shape[j][i]);
      }
    }
    setCurrentPiece(rotatedPiece);
  };

  const checkCollision = () => {
    const newBoard = [...board];
    const piece = currentPiece;
    for (let i = 0; i < piece.shape.length; i++) {
      for (let j = 0; j < piece.shape[i].length; j++) {
        if (piece.shape[i][j] === 1) {
          if (i + 1 >= 20) {
            setGameOver(true);
            return;
          }
          if (newBoard[i + 1][j] === 1) {
            setGameOver(true);
            return;
          }
        }
      }
    }
  };

  const clearLines = () => {
    const newBoard = [...board];
    let linesCleared = 0;
    for (let i = 0; i < newBoard.length; i++) {
      let isFull = true;
      for (let j = 0; j < newBoard[i].length; j++) {
        if (newBoard[i][j] === 0) {
          isFull = false;
          break;
        }
      }
      if (isFull) {
        newBoard.splice(i, 1);
        newBoard.unshift([]);
        for (let j = 0; j < 10; j++) {
          newBoard[0].push(0);
        }
        linesCleared++;
      }
    }
    setLines(lines + linesCleared);
    setScore(score + linesCleared * 100);
  };

  useEffect(() => {
    const board = createBoard();
    setBoard(board);
    spawnPiece();
    const intervalId = setInterval(() => {
      if (gameOver) return;
      movePiece('down');
      checkCollision();
      clearLines();
    }, 1000);
    return () => clearInterval(intervalId);
  }, [gameOver]);

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="w-1/2 h-1/2 border border-gray-500 flex flex-col">
        <div className="h-1/6 flex justify-center items-center text-3xl font-bold">
          {score}
        </div>
        <div className="h-5/6 flex justify-center items-center">
          {board.map((row, index) => (
            <div key={index} className="flex justify-center items-center">
              {row.map((cell, cellIndex) => (
                <div
                  key={cellIndex}
                  className={`w-10 h-10 border border-gray-500 ${
                    cell === 1 ? 'bg-blue-500' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="h-1/6 flex justify-center items-center text-3xl font-bold">
          {lines}
        </div>
      </div>
      <div className="w-1/4 h-1/2 border border-gray-500 flex flex-col justify-center items-center">
        <div className="h-1/2 flex justify-center items-center text-3xl font-bold">
          {nextPiece ? nextPiece.type : ''}
        </div>
        <div className="h-1/2 flex justify-center items-center">
          <button
            className="w-20 h-10 border border-gray-500 bg-gray-200 hover:bg-gray-300"
            onClick={() => movePiece('left')}
          >
            <ArrowLeft size={20} />
          </button>
          <button
            className="w-20 h-10 border border-gray-500 bg-gray-200 hover:bg-gray-300"
            onClick={() => movePiece('right')}
          >
            <ArrowRight size={20} />
          </button>
          <button
            className="w-20 h-10 border border-gray-500 bg-gray-200 hover:bg-gray-300"
            onClick={() => movePiece('down')}
          >
            <ArrowDown size={20} />
          </button>
          <button
            className="w-20 h-10 border border-gray-500 bg-gray-200 hover:bg-gray-300"
            onClick={rotatePiece}
          >
            Rotate
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;