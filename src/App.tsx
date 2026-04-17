import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, ArrowUp } from 'lucide-react';

const tetrominoes = {
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
    const handleKeyDown = (event) => {
      switch (event.key) {
        case 'ArrowLeft':
          moveTetrominoLeft();
          break;
        case 'ArrowRight':
          moveTetrominoRight();
          break;
        case 'ArrowUp':
          rotateTetromino();
          break;
        case 'ArrowDown':
          moveTetrominoDown();
          break;
        default:
          break;
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const createNewTetromino = () => {
    const tetrominoType = Object.keys(tetrominoes)[Math.floor(Math.random() * 7)];
    setCurrentTetromino(tetrominoes[tetrominoType]);
    setCurrentTetrominoX(5);
    setCurrentTetrominoY(0);
  };

  const moveTetrominoLeft = () => {
    if (currentTetrominoX > 0) {
      setCurrentTetrominoX(currentTetrominoX - 1);
    }
  };

  const moveTetrominoRight = () => {
    if (currentTetrominoX < 10 - currentTetromino[0].length) {
      setCurrentTetrominoX(currentTetrominoX + 1);
    }
  };

  const moveTetrominoDown = () => {
    if (currentTetrominoY < 20 - currentTetromino.length) {
      setCurrentTetrominoY(currentTetrominoY + 1);
    } else {
      addTetrominoToBoard();
      checkForFullRows();
      createNewTetromino();
    }
  };

  const rotateTetromino = () => {
    const rotatedTetromino = currentTetromino[0].map((_, index) => currentTetromino.map(row => row[index]).reverse());
    setCurrentTetromino(rotatedTetromino);
  };

  const addTetrominoToBoard = () => {
    const newBoard = [...board];
    for (let i = 0; i < currentTetromino.length; i++) {
      for (let j = 0; j < currentTetromino[0].length; j++) {
        if (currentTetromino[i][j] === 1) {
          newBoard[currentTetrominoY + i][currentTetrominoX + j] = 1;
        }
      }
    }
    setBoard(newBoard);
  };

  const checkForFullRows = () => {
    const newBoard = [...board];
    let rowsToRemove = 0;
    for (let i = 0; i < 20; i++) {
      if (newBoard[i].every(cell => cell === 1)) {
        newBoard.splice(i, 1);
        newBoard.unshift(Array(10).fill(0));
        rowsToRemove++;
      }
    }
    setBoard(newBoard);
    setScore(score + rowsToRemove * 100);
  };

  const handleRestart = () => {
    setBoard(Array(20).fill(0).map(() => Array(10).fill(0)));
    setCurrentTetromino(null);
    setCurrentTetrominoX(0);
    setCurrentTetrominoY(0);
    setScore(0);
    setGameOver(false);
    createNewTetromino();
  };

  if (gameOver) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-3xl font-bold">Game Over!</div>
        <div className="text-2xl font-bold">Final Score: {score}</div>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleRestart}>Restart</button>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="grid grid-cols-10 grid-rows-20 gap-1 w-64 h-128 border-2 border-gray-500">
        {board.map((row, rowIndex) => row.map((cell, columnIndex) => (
          <div key={`${rowIndex}-${columnIndex}`} className={`w-6 h-6 ${cell === 1 ? 'bg-blue-500' : 'bg-gray-200'}`} />
        )))}
        {currentTetromino && currentTetromino.map((row, rowIndex) => row.map((cell, columnIndex) => (
          <div key={`${rowIndex}-${columnIndex}`} className={`w-6 h-6 absolute top-${currentTetrominoY * 6 + rowIndex * 6} left-${currentTetrominoX * 6 + columnIndex * 6} ${cell === 1 ? 'bg-red-500' : 'bg-gray-200'}`} />
        )))}
      </div>
      <div className="text-2xl font-bold ml-4">Score: {score}</div>
      <div className="flex flex-col ml-4">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-2" onClick={moveTetrominoLeft}>
          <ArrowLeft size={24} />
        </button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-2" onClick={moveTetrominoRight}>
          <ArrowRight size={24} />
        </button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-2" onClick={rotateTetromino}>
          <ArrowUp size={24} />
        </button>
      </div>
    </div>
  );
};

export default App;