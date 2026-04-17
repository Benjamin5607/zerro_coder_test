import { useState, useEffect } from 'react';

const App = () => {
  const [gameBoard, setGameBoard] = useState(Array(20).fill(0).map(() => Array(10).fill(0)));
  const [tetrimino, setTetrimino] = useState({ x: 0, y: 0, color: 'bg-red-500' });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const board = Array(20).fill(0).map(() => Array(10).fill(0));
    setGameBoard(board);
  }, []);

  const moveTetrimino = (direction) => {
    switch (direction) {
      case 'up':
        setTetrimino((prev) => ({ ...prev, y: prev.y - 1 }));
        break;
      case 'down':
        setTetrimino((prev) => ({ ...prev, y: prev.y + 1 }));
        break;
      case 'left':
        setTetrimino((prev) => ({ ...prev, x: prev.x - 1 }));
        break;
      case 'right':
        setTetrimino((prev) => ({ ...prev, x: prev.x + 1 }));
        break;
      default:
        break;
    }
  };

  const checkCollision = () => {
    const { x, y, color } = tetrimino;
    const board = gameBoard;
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board[y + i][x + j] === 1 && color === 'bg-red-500') {
          return true;
        }
      }
    }
    return false;
  };

  const updateGameBoard = () => {
    const board = gameBoard;
    const { x, y, color } = tetrimino;
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board[y + i][x + j] === 1 && color === 'bg-red-500') {
          board[y + i][x + j] = 1;
        }
      }
    }
    setGameBoard(board);
  };

  const calculateScore = () => {
    const board = gameBoard;
    let score = 0;
    for (let i = 0; i < 20; i++) {
      let rowFilled = true;
      for (let j = 0; j < 10; j++) {
        if (board[i][j] === 0) {
          rowFilled = false;
          break;
        }
      }
      if (rowFilled) {
        score += 10;
        board.splice(i, 1);
        board.unshift(Array(10).fill(0));
      }
    }
    setScore(score);
  };

  const handleGameOver = () => {
    setGameOver(true);
    calculateScore();
  };

  const handleKeyDown = (event) => {
    switch (event.key) {
      case 'ArrowUp':
        moveTetrimino('up');
        break;
      case 'ArrowDown':
        moveTetrimino('down');
        break;
      case 'ArrowLeft':
        moveTetrimino('left');
        break;
      case 'ArrowRight':
        moveTetrimino('right');
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (checkCollision()) {
      updateGameBoard();
      handleGameOver();
    }
  }, [tetrimino]);

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="w-96 h-96 relative">
        {gameBoard.map((row, y) => (
          <div key={y} className="w-full h-12 relative">
            {row.map((cell, x) => (
              <div
                key={x}
                className={`w-6 h-6 absolute top-0 left-0 bg-slate-800 ${cell === 1 ? 'bg-red-500' : ''}`}
                style={{
                  transform: `translate(${x * 6}px, ${y * 6}px)`,
                }}
              />
            ))}
          </div>
        ))}
        <div
          className={`w-6 h-6 absolute top-0 left-0 bg-${tetrimino.color}`}
          style={{
            transform: `translate(${tetrimino.x * 6}px, ${tetrimino.y * 6}px)`,
          }}
        />
      </div>
      <div className="w-full h-12 flex justify-center items-center">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => moveTetrimino('up')}
        >
          ↑
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => moveTetrimino('down')}
        >
          ↓
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => moveTetrimino('left')}
        >
          ←
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => moveTetrimino('right')}
        >
          →
        </button>
      </div>
      <div className="w-full h-12 flex justify-center items-center">
        <p className="text-lg font-bold">Score: {score}</p>
      </div>
    </div>
  );
};

export default App;