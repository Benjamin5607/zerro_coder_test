import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, ArrowDown } from 'lucide-react';

const App = () => {
  const [board, setBoard] = useState(Array(20).fill(0).map(() => Array(10).fill(0)));
  const [currentTetromino, setCurrentTetromino] = useState(null);
  const [nextTetromino, setNextTetromino] = useState(null);
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);

  const tetrominos = [
    {
      shape: [
        [1, 1],
        [1, 1]
      ],
      color: 'red'
    },
    {
      shape: [
        [1, 1, 1],
        [0, 1, 0]
      ],
      color: 'blue'
    },
    {
      shape: [
        [1, 1, 1],
        [1, 0, 0]
      ],
      color: 'green'
    },
    {
      shape: [
        [1, 1, 1],
        [0, 0, 1]
      ],
      color: 'yellow'
    },
    {
      shape: [
        [1, 1, 0],
        [0, 1, 1]
      ],
      color: 'purple'
    },
    {
      shape: [
        [0, 1, 1],
        [1, 1, 0]
      ],
      color: 'orange'
    },
    {
      shape: [
        [1, 0, 0],
        [1, 1, 1]
      ],
      color: 'pink'
    }
  ];

  const getRandomTetromino = () => {
    const randomIndex = Math.floor(Math.random() * tetrominos.length);
    return tetrominos[randomIndex];
  };

  const rotateTetromino = (tetromino) => {
    if (!tetromino) return null;
    const rotatedShape = tetromino.shape[0].map((_, colIndex) => tetromino.shape.map(row => row[colIndex]).reverse());
    return { ...tetromino, shape: rotatedShape };
  };

  const moveTetromino = (direction) => {
    if (!currentTetromino) return;
    const newTetromino = { ...currentTetromino };
    switch (direction) {
      case 'left':
        newTetromino.x -= 1;
        break;
      case 'right':
        newTetromino.x += 1;
        break;
      case 'down':
        newTetromino.y += 1;
        break;
      default:
        break;
    }
    setCurrentTetromino(newTetromino);
  };

  const checkCollision = (tetromino, board) => {
    if (!tetromino || !board) return true;
    for (let i = 0; i < tetromino.shape.length; i++) {
      for (let j = 0; j < tetromino.shape[i].length; j++) {
        if (tetromino.shape[i][j] === 1) {
          const x = tetromino.x + j;
          const y = tetromino.y + i;
          if (x < 0 || x >= board[0].length || y < 0 || y >= board.length) return true;
          if (board[y][x] === 1) return true;
        }
      }
    }
    return false;
  };

  const clearLines = (board) => {
    if (!board) return 0;
    let linesCleared = 0;
    for (let i = 0; i < board.length; i++) {
      if (board[i].every(cell => cell === 1)) {
        board.splice(i, 1);
        board.unshift(Array(10).fill(0));
        linesCleared++;
      }
    }
    return linesCleared;
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!currentTetromino) return;
      moveTetromino('down');
    }, 1000);
    return () => clearInterval(intervalId);
  }, [currentTetromino]);

  useEffect(() => {
    if (!currentTetromino) return;
    if (checkCollision(currentTetromino, board)) {
      const newBoard = [...board];
      for (let i = 0; i < currentTetromino.shape.length; i++) {
        for (let j = 0; j < currentTetromino.shape[i].length; j++) {
          if (currentTetromino.shape[i][j] === 1) {
            const x = currentTetromino.x + j;
            const y = currentTetromino.y + i;
            newBoard[y][x] = 1;
          }
        }
      }
      setBoard(newBoard);
      setLines(lines + clearLines(newBoard));
      setScore(score + 10);
      setCurrentTetromino(null);
    }
  }, [currentTetromino, board]);

  useEffect(() => {
    if (!currentTetromino) {
      const newTetromino = getRandomTetromino();
      setCurrentTetromino({ ...newTetromino, x: 3, y: 0 });
    }
  }, [currentTetromino]);

  const handleKeyPress = (event) => {
    switch (event.key) {
      case 'ArrowLeft':
        moveTetromino('left');
        break;
      case 'ArrowRight':
        moveTetromino('right');
        break;
      case 'ArrowDown':
        moveTetromino('down');
        break;
      case 'ArrowUp':
        setCurrentTetromino(rotateTetromino(currentTetromino));
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [currentTetromino]);

  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <div className="grid grid-cols-10 grid-rows-20 gap-1 w-80 h-80 border-2 border-gray-500">
        {board.map((row, rowIndex) => row.map((cell, cellIndex) => (
          <div key={`${rowIndex}-${cellIndex}`} className={`w-8 h-8 ${cell === 1 ? 'bg-blue-500' : 'bg-gray-200'}`} />
        )))}
      </div>
      <div className="ml-10">
        <h1 className="text-3xl font-bold">Score: {score}</h1>
        <h1 className="text-3xl font-bold">Lines: {lines}</h1>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => setCurrentTetromino(rotateTetromino(currentTetromino))}>
          <ArrowLeft size={24} />
        </button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => moveTetromino('left')}>
          <ArrowLeft size={24} />
        </button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => moveTetromino('right')}>
          <ArrowRight size={24} />
        </button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => moveTetromino('down')}>
          <ArrowDown size={24} />
        </button>
      </div>
    </div>
  );
};

export default App;