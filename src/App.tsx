import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, ArrowDown } from 'lucide-react';

const tetrominoFactory = () => {
  const shapes = [
    [
      [1, 1],
      [1, 1],
    ],
    [
      [1, 1, 1],
      [0, 1, 0],
    ],
    [
      [0, 1, 0],
      [1, 1, 1],
    ],
    [
      [1, 1, 1, 1],
    ],
    [
      [1, 1, 0],
      [0, 1, 1],
    ],
    [
      [0, 1, 1],
      [1, 1, 0],
    ],
    [
      [1, 0, 0],
      [1, 1, 1],
    ],
  ];

  const randomIndex = Math.floor(Math.random() * shapes.length);
  return shapes[randomIndex];
};

const checkTetrominoCollision = (tetromino, position, grid) => {
  if (!tetromino) return;
  for (let i = 0; i < tetromino.length; i++) {
    for (let j = 0; j < tetromino[i].length; j++) {
      if (tetromino[i][j] === 1) {
        const x = position.x + j;
        const y = position.y + i;
        if (x < 0 || x >= grid[0].length || y < 0 || y >= grid.length) {
          return true;
        }
        if (grid[y][x] === 1) {
          return true;
        }
      }
    }
  }
  return false;
};

const updateTetrominoPosition = (tetromino, position, direction) => {
  if (!tetromino) return position;
  switch (direction) {
    case 'left':
      return { x: position.x - 1, y: position.y };
    case 'right':
      return { x: position.x + 1, y: position.y };
    case 'down':
      return { x: position.x, y: position.y + 1 };
    default:
      return position;
  }
};

const removeTetromino = (grid, tetromino, position) => {
  if (!tetromino) return grid;
  for (let i = 0; i < tetromino.length; i++) {
    for (let j = 0; j < tetromino[i].length; j++) {
      if (tetromino[i][j] === 1) {
        const x = position.x + j;
        const y = position.y + i;
        grid[y][x] = 0;
      }
    }
  }
  return grid;
};

const rotateTetromino = (tetromino) => {
  if (!tetromino) return tetromino;
  return tetromino[0].map((_, colIndex) => tetromino.map((row) => row[colIndex]).reverse());
};

const moveTetrominoDown = (tetromino, position, grid) => {
  if (!tetromino) return position;
  const newPosition = updateTetrominoPosition(tetromino, position, 'down');
  if (checkTetrominoCollision(tetromino, newPosition, grid)) {
    return position;
  }
  return newPosition;
};

const gameLoop = (tetromino, position, grid) => {
  const newPosition = moveTetrominoDown(tetromino, position, grid);
  if (newPosition.y >= grid.length - tetromino.length) {
    removeTetromino(grid, tetromino, position);
    return { tetromino: tetrominoFactory(), position: { x: 0, y: 0 } };
  }
  return { tetromino, position: newPosition };
};

const App = () => {
  const [grid, setGrid] = useState([
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]);
  const [tetromino, setTetromino] = useState(tetrominoFactory());
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const intervalId = setInterval(() => {
      const newGameState = gameLoop(tetromino, position, grid);
      setTetromino(newGameState.tetromino);
      setPosition(newGameState.position);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [tetromino, position, grid]);

  const handleKeyPress = (event) => {
    switch (event.key) {
      case 'ArrowLeft':
        const newPosition = updateTetrominoPosition(tetromino, position, 'left');
        if (!checkTetrominoCollision(tetromino, newPosition, grid)) {
          setPosition(newPosition);
        }
        break;
      case 'ArrowRight':
        const newPositionRight = updateTetrominoPosition(tetromino, position, 'right');
        if (!checkTetrominoCollision(tetromino, newPositionRight, grid)) {
          setPosition(newPositionRight);
        }
        break;
      case 'ArrowDown':
        const newPositionDown = updateTetrominoPosition(tetromino, position, 'down');
        if (!checkTetrominoCollision(tetromino, newPositionDown, grid)) {
          setPosition(newPositionDown);
        }
        break;
      case 'ArrowUp':
        const rotatedTetromino = rotateTetromino(tetromino);
        if (!checkTetrominoCollision(rotatedTetromino, position, grid)) {
          setTetromino(rotatedTetromino);
        }
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [tetromino, position, grid]);

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="w-80 h-80 border-2 border-gray-500 flex flex-col">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="flex">
            {row.map((cell, cellIndex) => (
              <div
                key={cellIndex}
                className={`w-8 h-8 border-2 border-gray-500 ${
                  cell === 1 ? 'bg-gray-500' : 'bg-white'
                }`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="absolute top-0 left-0 flex flex-col">
        <ArrowLeft size={24} className="text-gray-500" />
        <ArrowRight size={24} className="text-gray-500" />
        <ArrowDown size={24} className="text-gray-500" />
      </div>
    </div>
  );
};

export default App;