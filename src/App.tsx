import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, ArrowDown, ArrowUp, Play } from 'lucide-react';

const initialState = {
  grid: Array(20).fill(0).map(() => Array(10).fill(0)),
  currentBlock: {
    x: 5,
    y: 0,
    shape: [
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  },
  score: 0,
  gameOver: false,
  highScore: localStorage.getItem('highScore') || 0,
};

const useTetrisState = () => {
  const [state, setState] = useState(initialState);

  useEffect(() => {
    localStorage.setItem('highScore', state.highScore);
  }, [state.highScore]);

  const createNewBlock = () => {
    setState({
      ...state,
      currentBlock: {
        x: 5,
        y: 0,
        shape: [
          [1, 1, 1, 1],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ],
      },
    });
  };

  const moveBlock = (direction) => {
    switch (direction) {
      case 'left':
        if (state.currentBlock.x > 0) {
          setState({
            ...state,
            currentBlock: {
              ...state.currentBlock,
              x: state.currentBlock.x - 1,
            },
          });
        }
        break;
      case 'right':
        if (state.currentBlock.x < 9) {
          setState({
            ...state,
            currentBlock: {
              ...state.currentBlock,
              x: state.currentBlock.x + 1,
            },
          });
        }
        break;
      case 'down':
        setState({
          ...state,
          currentBlock: {
            ...state.currentBlock,
            y: state.currentBlock.y + 1,
          },
        });
        break;
      default:
        break;
    }
  };

  const rotateBlock = () => {
    const rotatedShape = state.currentBlock.shape[0].map((_, i) => state.currentBlock.shape.map(row => row[i]));
    setState({
      ...state,
      currentBlock: {
        ...state.currentBlock,
        shape: rotatedShape,
      },
    });
  };

  const fixBlock = () => {
    const fixedGrid = state.grid.map((row, y) => {
      return row.map((cell, x) => {
        if (state.currentBlock.shape[y][x] === 1) {
          return 1;
        } else {
          return cell;
        }
      });
    });
    setState({
      ...state,
      grid: fixedGrid,
      score: state.score + 1,
      currentBlock: {
        x: 5,
        y: 0,
        shape: [
          [1, 1, 1, 1],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ],
      },
    });
  };

  const updateScore = () => {
    if (state.score > state.highScore) {
      setState({
        ...state,
        highScore: state.score,
      });
    }
  };

  const restartGame = () => {
    setState(initialState);
  };

  return {
    state,
    createNewBlock,
    moveBlock,
    rotateBlock,
    fixBlock,
    updateScore,
    restartGame,
  };
};

const App = () => {
  const {
    state,
    createNewBlock,
    moveBlock,
    rotateBlock,
    fixBlock,
    updateScore,
    restartGame,
  } = useTetrisState();

  const handleKeyDown = (event) => {
    switch (event.key) {
      case 'ArrowLeft':
        moveBlock('left');
        break;
      case 'ArrowRight':
        moveBlock('right');
        break;
      case 'ArrowDown':
        moveBlock('down');
        break;
      case 'ArrowUp':
        rotateBlock();
        break;
      default:
        break;
    }
  };

  const handleFixBlock = () => {
    fixBlock();
    updateScore();
  };

  const handleRestartGame = () => {
    restartGame();
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    createNewBlock();
  }, []);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="grid grid-cols-10 grid-rows-20 w-400 h-600 border border-black">
        {state.grid.map((row, y) => (
          <div key={y} className="flex justify-center items-center h-20 w-400">
            {row.map((cell, x) => (
              <div
                key={x}
                className={`w-20 h-20 ${cell === 1 ? 'bg-gray-500' : 'bg-transparent'}`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="absolute top-0 left-0">
        {state.currentBlock.shape.map((row, y) => (
          <div key={y} className="flex justify-center items-center h-20 w-400">
            {row.map((cell, x) => (
              <div
                key={x}
                className={`w-20 h-20 ${cell === 1 ? 'bg-gray-500' : 'bg-transparent'}`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="text-red-500 font-bold text-24 text-center">
        {state.gameOver ? 'Game Over' : ''}
      </div>
      <div className="text-blue-500 font-bold text-18 text-center">
        Score: {state.score}
      </div>
      <div className="text-green-500 font-bold text-18 text-center">
        High Score: {state.highScore}
      </div>
      <button
        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleRestartGame}
      >
        <Play className="w-6 h-6" />
      </button>
    </div>
  );
};

export default App;