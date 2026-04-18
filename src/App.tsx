import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, ArrowDown, ArrowUp } from 'lucide-react';

const App = () => {
  const [gameBoard, setGameBoard] = useState([]);
  const [tetromino, setTetromino] = useState(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [boardSize, setBoardSize] = useState({ width: 10, height: 20 });
  const [tetrominoType, setTetrominoType] = useState('I');
  const [difficulty, setDifficulty] = useState('easy');
  const [colors, setColors] = useState({ background: 'bg-gray-800', tetromino: 'bg-blue-500' });

  useEffect(() => {
    if (gameStarted) {
      createGameBoard();
      createTetromino();
    }
  }, [gameStarted]);

  const createGameBoard = () => {
    const board = [];
    for (let i = 0; i < boardSize.height; i++) {
      board.push([]);
      for (let j = 0; j < boardSize.width; j++) {
        board[i].push(0);
      }
    }
    setGameBoard(board);
  };

  const createTetromino = () => {
    const types = {
      I: [
        [1, 1, 1, 1]
      ],
      J: [
        [1, 0, 0],
        [1, 1, 1]
      ],
      L: [
        [0, 0, 1],
        [1, 1, 1]
      ],
      O: [
        [1, 1],
        [1, 1]
      ],
      S: [
        [0, 1, 1],
        [1, 1, 0]
      ],
      T: [
        [0, 1, 0],
        [1, 1, 1]
      ],
      Z: [
        [1, 1, 0],
        [0, 1, 1]
      ]
    };
    const tetromino = types[tetrominoType];
    setTetromino(tetromino);
  };

  const handleMoveLeft = () => {
    if (tetromino && gameStarted) {
      const newTetromino = [...tetromino];
      for (let i = 0; i < newTetromino.length; i++) {
        for (let j = 0; j < newTetromino[i].length; j++) {
          if (newTetromino[i][j] === 1) {
            if (j === 0) return;
            newTetromino[i][j - 1] = 1;
            newTetromino[i][j] = 0;
          }
        }
      }
      setTetromino(newTetromino);
    }
  };

  const handleMoveRight = () => {
    if (tetromino && gameStarted) {
      const newTetromino = [...tetromino];
      for (let i = 0; i < newTetromino.length; i++) {
        for (let j = newTetromino[i].length - 1; j >= 0; j--) {
          if (newTetromino[i][j] === 1) {
            if (j === newTetromino[i].length - 1) return;
            newTetromino[i][j + 1] = 1;
            newTetromino[i][j] = 0;
          }
        }
      }
      setTetromino(newTetromino);
    }
  };

  const handleMoveDown = () => {
    if (tetromino && gameStarted) {
      const newTetromino = [...tetromino];
      for (let i = newTetromino.length - 1; i >= 0; i--) {
        for (let j = 0; j < newTetromino[i].length; j++) {
          if (newTetromino[i][j] === 1) {
            if (i === newTetromino.length - 1) return;
            newTetromino[i + 1][j] = 1;
            newTetromino[i][j] = 0;
          }
        }
      }
      setTetromino(newTetromino);
    }
  };

  const handleRotate = () => {
    if (tetromino && gameStarted) {
      const newTetromino = [...tetromino];
      for (let i = 0; i < newTetromino.length; i++) {
        for (let j = 0; j < newTetromino[i].length; j++) {
          if (newTetromino[i][j] === 1) {
            newTetromino[j][newTetromino.length - 1 - i] = 1;
          }
        }
      }
      setTetromino(newTetromino);
    }
  };

  const handleStartGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
  };

  const handleEndGame = () => {
    setGameStarted(false);
    setGameOver(true);
  };

  const handleSettings = () => {
    // settings logic
  };

  if (!gameStarted) {
    return (
      <div className={`h-screen ${colors.background} flex justify-center items-center`}>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleStartGame}>
          Start Game
        </button>
      </div>
    );
  }

  if (gameOver) {
    return (
      <div className={`h-screen ${colors.background} flex justify-center items-center`}>
        <div className="text-white font-bold text-3xl">
          Game Over!
        </div>
        <div className="text-white font-bold text-2xl">
          Score: {score}
        </div>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleStartGame}>
          Play Again
        </button>
      </div>
    );
  }

  return (
    <div className={`h-screen ${colors.background} flex justify-center items-center`}>
      <div className="grid grid-cols-10 grid-rows-20 gap-1 w-64 h-96 border-2 border-white">
        {gameBoard.map((row, i) => (
          row.map((cell, j) => (
            <div key={`${i}-${j}`} className={`w-6 h-6 ${cell === 1 ? colors.tetromino : 'bg-gray-600'}`}></div>
          ))
        ))}
      </div>
      <div className="absolute top-0 left-0 p-4">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleMoveLeft}>
          <ArrowLeft size={24} />
        </button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleMoveRight}>
          <ArrowRight size={24} />
        </button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleMoveDown}>
          <ArrowDown size={24} />
        </button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleRotate}>
          <ArrowUp size={24} />
        </button>
      </div>
      <div className="absolute bottom-0 left-0 p-4">
        <div className="text-white font-bold text-2xl">
          Score: {score}
        </div>
      </div>
    </div>
  );
};

export default App;