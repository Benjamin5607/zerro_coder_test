import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, ArrowUp } from 'lucide-react';

const App = () => {
  const [grid, setGrid] = useState(Array(20).fill(0).map(() => Array(10).fill(0)));
  const [currentTetromino, setCurrentTetromino] = useState(null);
  const [score, setScore] = useState(0);

  const tetrominos = [
    {
      shape: [
        [1, 1, 1, 1]
      ],
      color: 'red'
    },
    {
      shape: [
        [1, 1],
        [1, 1]
      ],
      color: 'blue'
    },
    {
      shape: [
        [1, 1, 1],
        [0, 1, 0]
      ],
      color: 'green'
    },
    {
      shape: [
        [1, 1, 1],
        [1, 0, 0]
      ],
      color: 'yellow'
    },
    {
      shape: [
        [1, 1, 1],
        [0, 0, 1]
      ],
      color: 'purple'
    },
    {
      shape: [
        [1, 1, 0],
        [0, 1, 1]
      ],
      color: 'orange'
    },
    {
      shape: [
        [0, 1, 1],
        [1, 1, 0]
      ],
      color: 'pink'
    }
  ];

  const canMoveTetrominoDown = () => {
    if (!currentTetromino) return;
    const newTetromino = { ...currentTetromino };
    newTetromino.y += 1;
    if (isCollision(newTetromino)) return false;
    return true;
  };

  const canMoveTetrominoLeft = () => {
    if (!currentTetromino) return;
    const newTetromino = { ...currentTetromino };
    newTetromino.x -= 1;
    if (isCollision(newTetromino)) return false;
    return true;
  };

  const canMoveTetrominoRight = () => {
    if (!currentTetromino) return;
    const newTetromino = { ...currentTetromino };
    newTetromino.x += 1;
    if (isCollision(newTetromino)) return false;
    return true;
  };

  const canMoveTetrominoUp = () => {
    if (!currentTetromino) return;
    const newTetromino = { ...currentTetromino };
    newTetromino.y -= 1;
    if (isCollision(newTetromino)) return false;
    return true;
  };

  const canRotateTetromino = () => {
    if (!currentTetromino) return;
    const newTetromino = { ...currentTetromino };
    newTetromino.shape = rotateShape(newTetromino.shape);
    if (isCollision(newTetromino)) return false;
    return true;
  };

  const removeFullLines = () => {
    if (!currentTetromino) return;
    const newGrid = [...grid];
    for (let i = 0; i < newGrid.length; i++) {
      if (isFullLine(newGrid[i])) {
        newGrid.splice(i, 1);
        newGrid.unshift(Array(10).fill(0));
        setScore(score + 1);
      }
    }
    setGrid(newGrid);
  };

  const updateGrid = () => {
    if (!currentTetromino) return;
    const newGrid = [...grid];
    for (let i = 0; i < currentTetromino.shape.length; i++) {
      for (let j = 0; j < currentTetromino.shape[i].length; j++) {
        if (currentTetromino.shape[i][j] === 1) {
          newGrid[currentTetromino.y + i][currentTetromino.x + j] = 1;
        }
      }
    }
    setGrid(newGrid);
  };

  const drawTetromino = () => {
    if (!currentTetromino) return;
    const newGrid = [...grid];
    for (let i = 0; i < currentTetromino.shape.length; i++) {
      for (let j = 0; j < currentTetromino.shape[i].length; j++) {
        if (currentTetromino.shape[i][j] === 1) {
          newGrid[currentTetromino.y + i][currentTetromino.x + j] = 1;
        }
      }
    }
    setGrid(newGrid);
  };

  const gameLoop = () => {
    if (!currentTetromino) {
      const newTetromino = {
        shape: tetrominos[Math.floor(Math.random() * tetrominos.length)].shape,
        color: tetrominos[Math.floor(Math.random() * tetrominos.length)].color,
        x: 3,
        y: 0
      };
      setCurrentTetromino(newTetromino);
    }
    if (canMoveTetrominoDown()) {
      const newTetromino = { ...currentTetromino };
      newTetromino.y += 1;
      setCurrentTetromino(newTetromino);
    } else {
      updateGrid();
      removeFullLines();
      const newTetromino = {
        shape: tetrominos[Math.floor(Math.random() * tetrominos.length)].shape,
        color: tetrominos[Math.floor(Math.random() * tetrominos.length)].color,
        x: 3,
        y: 0
      };
      setCurrentTetromino(newTetromino);
    }
    setTimeout(gameLoop, 1000);
  };

  const isCollision = (tetromino) => {
    for (let i = 0; i < tetromino.shape.length; i++) {
      for (let j = 0; j < tetromino.shape[i].length; j++) {
        if (tetromino.shape[i][j] === 1) {
          if (tetromino.x + j < 0 || tetromino.x + j >= 10) return true;
          if (tetromino.y + i < 0 || tetromino.y + i >= 20) return true;
          if (grid[tetromino.y + i][tetromino.x + j] === 1) return true;
        }
      }
    }
    return false;
  };

  const isFullLine = (line) => {
    for (let i = 0; i < line.length; i++) {
      if (line[i] === 0) return false;
    }
    return true;
  };

  const rotateShape = (shape) => {
    const newShape = [];
    for (let i = 0; i < shape[0].length; i++) {
      newShape.push([]);
      for (let j = shape.length - 1; j >= 0; j--) {
        newShape[i].push(shape[j][i]);
      }
    }
    return newShape;
  };

  useEffect(() => {
    gameLoop();
  }, []);

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="w-200 h-400 border-2 border-gray-500">
        {grid.map((line, i) => (
          <div key={i} className="flex">
            {line.map((cell, j) => (
              <div key={j} className={`w-20 h-20 ${cell === 1 ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
            ))}
          </div>
        ))}
      </div>
      <div className="ml-10">
        <ArrowLeft size={24} className="cursor-pointer" onClick={() => {
          if (canMoveTetrominoLeft()) {
            const newTetromino = { ...currentTetromino };
            newTetromino.x -= 1;
            setCurrentTetromino(newTetromino);
          }
        }} />
        <ArrowRight size={24} className="cursor-pointer" onClick={() => {
          if (canMoveTetrominoRight()) {
            const newTetromino = { ...currentTetromino };
            newTetromino.x += 1;
            setCurrentTetromino(newTetromino);
          }
        }} />
        <ArrowUp size={24} className="cursor-pointer" onClick={() => {
          if (canRotateTetromino()) {
            const newTetromino = { ...currentTetromino };
            newTetromino.shape = rotateShape(newTetromino.shape);
            setCurrentTetromino(newTetromino);
          }
        }} />
      </div>
    </div>
  );
};

export default App;