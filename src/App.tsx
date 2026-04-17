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
  S: [
    [0, 1, 1],
    [1, 1, 0]
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1]
  ],
  O: [
    [1, 1],
    [1, 1]
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1]
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1]
  ]
};

const App = () => {
  const [grid, setGrid] = useState(Array(20).fill(0).map(() => Array(10).fill(0)));
  const [currentTetromino, setCurrentTetromino] = useState(null);
  const [currentTetrominoX, setCurrentTetrominoX] = useState(0);
  const [currentTetrominoY, setCurrentTetrominoY] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameSpeed, setGameSpeed] = useState(1000);
  const [music, setMusic] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!gameOver) {
        moveTetrominoDown();
      }
    }, gameSpeed);
    return () => clearInterval(intervalId);
  }, [gameOver, gameSpeed]);

  const createTetromino = () => {
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
      createTetromino();
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
          if (currentTetrominoY + i + 1 >= grid.length) {
            return false;
          }
          if (grid[currentTetrominoY + i + 1][currentTetrominoX + j] === 1) {
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
          if (grid[currentTetrominoY + i][currentTetrominoX + j - 1] === 1) {
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
          if (currentTetrominoX + j + 1 >= grid[0].length) {
            return false;
          }
          if (grid[currentTetrominoY + i][currentTetrominoX + j + 1] === 1) {
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
          if (currentTetrominoX + j < 0 || currentTetrominoX + j >= grid[0].length) {
            return false;
          }
          if (currentTetrominoY + i < 0 || currentTetrominoY + i >= grid.length) {
            return false;
          }
          if (grid[currentTetrominoY + i][currentTetrominoX + j] === 1) {
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
          grid[currentTetrominoY + i][currentTetrominoX + j] = 1;
        }
      }
    }
    checkForCompleteLines();
  };

  const checkForCompleteLines = () => {
    for (let i = 0; i < grid.length; i++) {
      let complete = true;
      for (let j = 0; j < grid[i].length; j++) {
        if (grid[i][j] === 0) {
          complete = false;
          break;
        }
      }
      if (complete) {
        removeLine(i);
        i--;
      }
    }
  };

  const removeLine = (lineIndex) => {
    grid.splice(lineIndex, 1);
    grid.unshift(Array(10).fill(0));
    setScore(score + 100);
  };

  const rotateMatrix = (matrix) => {
    return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]).reverse());
  };

  const handleKeyPress = (event) => {
    switch (event.key) {
      case 'ArrowLeft':
        moveTetrominoLeft();
        break;
      case 'ArrowRight':
        moveTetrominoRight();
        break;
      case 'ArrowDown':
        moveTetrominoDown();
        break;
      case ' ':
        rotateTetromino();
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);

  useEffect(() => {
    createTetromino();
  }, []);

  if (gameOver) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-3xl font-bold">Game Over!</div>
        <div className="text-2xl font-bold">Score: {score}</div>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => window.location.reload()}>Play Again</button>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="grid grid-cols-10 grid-rows-20 gap-1 w-64 h-64 border-2 border-gray-500">
        {grid.map((row, rowIndex) => row.map((cell, columnIndex) => (
          <div key={`${rowIndex}-${columnIndex}`} className={`w-6 h-6 ${cell === 1 ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
        )))}
      </div>
      <div className="ml-4">
        <div className="text-2xl font-bold">Score: {score}</div>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => setGameSpeed(gameSpeed - 100)}>Faster</button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => setGameSpeed(gameSpeed + 100)}>Slower</button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => setMusic(!music)}>Toggle Music</button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => setSoundEffects(!soundEffects)}>Toggle Sound Effects</button>
      </div>
    </div>
  );
};

export default App;