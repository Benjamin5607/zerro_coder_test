import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, ArrowDown } from 'lucide-react';

const tetrominos = {
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

const App = () => {
  const [board, setBoard] = useState(Array(20).fill(0).map(() => Array(10).fill(0)));
  const [currentTetromino, setCurrentTetromino] = useState(null);
  const [currentTetrominoX, setCurrentTetrominoX] = useState(0);
  const [currentTetrominoY, setCurrentTetrominoY] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!gameOver) {
        moveTetrominoDown();
      }
    }, 1000);
    return () => clearInterval(intervalId);
  }, [gameOver]);

  useEffect(() => {
    if (!currentTetromino) {
      spawnNewTetromino();
    }
  }, [currentTetromino]);

  const spawnNewTetromino = () => {
    const tetrominoType = Object.keys(tetrominos)[Math.floor(Math.random() * Object.keys(tetrominos).length)];
    const tetromino = tetrominos[tetrominoType];
    setCurrentTetromino(tetromino);
    setCurrentTetrominoX(5 - Math.floor(tetromino[0].length / 2));
    setCurrentTetrominoY(0);
  };

  const moveTetrominoDown = () => {
    if (canMoveTetrominoDown()) {
      setCurrentTetrominoY(currentTetrominoY + 1);
    } else {
      placeTetromino();
      checkForLines();
      spawnNewTetromino();
    }
  };

  const moveTetrominoLeft = () => {
    if (canMoveTetrominoLeft()) {
      setCurrentTetrominoX(currentTetrominoX - 1);
    }
  };

  const moveTetrominoRight = () => {
    if (canMoveTetrominoRight()) {
      setCurrentTetrominoX(currentTetrominoX + 1);
    }
  };

  const rotateTetromino = () => {
    if (canRotateTetromino()) {
      const rotatedTetromino = rotateMatrix(currentTetromino);
      setCurrentTetromino(rotatedTetromino);
    }
  };

  const canMoveTetrominoDown = () => {
    for (let i = 0; i < currentTetromino.length; i++) {
      for (let j = 0; j < currentTetromino[i].length; j++) {
        if (currentTetromino[i][j] === 1) {
          if (currentTetrominoY + i + 1 >= board.length) {
            return false;
          }
          if (board[currentTetrominoY + i + 1][currentTetrominoX + j] === 1) {
            return false;
          }
        }
      }
    }
    return true;
  };

  const canMoveTetrominoLeft = () => {
    for (let i = 0; i < currentTetromino.length; i++) {
      for (let j = 0; j < currentTetromino[i].length; j++) {
        if (currentTetromino[i][j] === 1) {
          if (currentTetrominoX + j - 1 < 0) {
            return false;
          }
          if (board[currentTetrominoY + i][currentTetrominoX + j - 1] === 1) {
            return false;
          }
        }
      }
    }
    return true;
  };

  const canMoveTetrominoRight = () => {
    for (let i = 0; i < currentTetromino.length; i++) {
      for (let j = 0; j < currentTetromino[i].length; j++) {
        if (currentTetromino[i][j] === 1) {
          if (currentTetrominoX + j + 1 >= board[0].length) {
            return false;
          }
          if (board[currentTetrominoY + i][currentTetrominoX + j + 1] === 1) {
            return false;
          }
        }
      }
    }
    return true;
  };

  const canRotateTetromino = () => {
    const rotatedTetromino = rotateMatrix(currentTetromino);
    for (let i = 0; i < rotatedTetromino.length; i++) {
      for (let j = 0; j < rotatedTetromino[i].length; j++) {
        if (rotatedTetromino[i][j] === 1) {
          if (currentTetrominoX + j < 0 || currentTetrominoX + j >= board[0].length) {
            return false;
          }
          if (currentTetrominoY + i < 0 || currentTetrominoY + i >= board.length) {
            return false;
          }
          if (board[currentTetrominoY + i][currentTetrominoX + j] === 1) {
            return false;
          }
        }
      }
    }
    return true;
  };

  const placeTetromino = () => {
    for (let i = 0; i < currentTetromino.length; i++) {
      for (let j = 0; j < currentTetromino[i].length; j++) {
        if (currentTetromino[i][j] === 1) {
          board[currentTetrominoY + i][currentTetrominoX + j] = 1;
        }
      }
    }
  };

  const checkForLines = () => {
    let linesCleared = 0;
    for (let i = 0; i < board.length; i++) {
      let isFullLine = true;
      for (let j = 0; j < board[i].length; j++) {
        if (board[i][j] === 0) {
          isFullLine = false;
          break;
        }
      }
      if (isFullLine) {
        linesCleared++;
        board.splice(i, 1);
        board.unshift(Array(10).fill(0));
      }
    }
    setScore(score + linesCleared * linesCleared);
  };

  const rotateMatrix = (matrix) => {
    return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]).reverse());
  };

  const handleKeyPress = (event) => {
    if (event.key === 'ArrowLeft') {
      moveTetrominoLeft();
    } else if (event.key === 'ArrowRight') {
      moveTetrominoRight();
    } else if (event.key === 'ArrowDown') {
      moveTetrominoDown();
    } else if (event.key === ' ') {
      rotateTetromino();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);

  if (gameOver) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-3xl font-bold">Game Over!</div>
        <div className="text-2xl font-bold">Score: {score}</div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="grid grid-cols-10 grid-rows-20 gap-1 w-64 h-64 border-2 border-gray-500">
        {board.map((row, rowIndex) => row.map((cell, columnIndex) => (
          <div key={`${rowIndex}-${columnIndex}`} className={`w-6 h-6 ${cell === 1 ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
        )))}
      </div>
      {currentTetromino && (
        <div className="absolute">
          {currentTetromino.map((row, rowIndex) => row.map((cell, columnIndex) => (
            <div key={`${rowIndex}-${columnIndex}`} className={`w-6 h-6 ${cell === 1 ? 'bg-red-500' : 'bg-gray-200'} absolute top-${currentTetrominoY * 6 + rowIndex * 6} left-${currentTetrominoX * 6 + columnIndex * 6}`}></div>
          )))}
        </div>
      )}
      <div className="text-2xl font-bold">Score: {score}</div>
      <div className="flex justify-center items-center">
        <ArrowLeft className="w-6 h-6 cursor-pointer" onClick={moveTetrominoLeft} />
        <ArrowRight className="w-6 h-6 cursor-pointer" onClick={moveTetrominoRight} />
        <ArrowDown className="w-6 h-6 cursor-pointer" onClick={moveTetrominoDown} />
      </div>
    </div>
  );
};

export default App;