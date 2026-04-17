import React, { useState, useEffect } from 'react';

const initialState = {
  currentBlock: {
    x: 0,
    y: 0,
    rotation: 0,
    shape: [
      [1, 1, 1, 1],
    ],
    color: 'blue',
  },
  grid: Array(20).fill(0).map(() => Array(10).fill(false)),
  score: 0,
  gameOver: false,
};

function App() {
  const [state, setState] = useState(initialState);

  useEffect(() => {
    const createBlock = () => {
      const x = Math.floor(Math.random() * 10);
      const y = 0;
      const rotation = Math.floor(Math.random() * 4);
      const shape = getShape(rotation);
      const color = getRandomColor();
      setState((prev) => ({ ...prev, currentBlock: { x, y, rotation, shape, color } }));
    };

    const moveBlock = () => {
      const { currentBlock } = state;
      const { x, y, rotation } = currentBlock;
      const { shape } = currentBlock;
      const newShape = getNewShape(shape, rotation);
      const newX = x + 1;
      const newY = y;
      setState((prev) => ({ ...prev, currentBlock: { x: newX, y: newY, rotation, shape: newShape } }));
    };

    const checkGameOver = () => {
      const { currentBlock } = state;
      const { x, y, shape } = currentBlock;
      if (y >= 20) {
        setState((prev) => ({ ...prev, gameOver: true }));
      }
    };

    const checkLineClear = () => {
      const { grid } = state;
      const newGrid = [];
      grid.forEach((row, y) => {
        const newRow = [];
        row.forEach((block, x) => {
          if (block) {
            const { shape } = state.currentBlock;
            const newShape = getNewShape(shape, state.currentBlock.rotation);
            if (newShape[x] && newShape[x][y]) {
              newRow.push(block);
            } else {
              newRow.push(false);
            }
          } else {
            newRow.push(false);
          }
        });
        newGrid.push(newRow);
      });
      setState((prev) => ({ ...prev, grid: newGrid }));
    };

    const updateScore = () => {
      const { score } = state;
      setState((prev) => ({ ...prev, score: score + 1 }));
    };

    const intervalId = setInterval(() => {
      moveBlock();
      checkGameOver();
      checkLineClear();
      updateScore();
    }, 1000);

    createBlock();

    return () => clearInterval(intervalId);
  }, [state]);

  const getShape = (rotation) => {
    switch (rotation) {
      case 0:
        return [
          [1, 1, 1, 1],
        ];
      case 1:
        return [
          [1],
          [1, 1, 1],
        ];
      case 2:
        return [
          [1, 1],
          [1, 1],
        ];
      case 3:
        return [
          [1, 1, 1],
        ];
      default:
        return [
          [1, 1, 1, 1],
        ];
    }
  };

  const getNewShape = (shape, rotation) => {
    switch (rotation) {
      case 0:
        return shape;
      case 1:
        return shape.map((row) => row.reverse());
      case 2:
        return shape[0].map((_, i) => shape[shape.length - 1 - i]);
      case 3:
        return shape.map((row) => row.reverse()).reverse();
      default:
        return shape;
    }
  };

  const getRandomColor = () => {
    const colors = ['red', 'green', 'blue', 'yellow', 'orange', 'purple'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div className="grid w-96 h-96">
      {state.grid.map((row, y) => (
        <div key={y} className="flex">
          {row.map((block, x) => (
            <div
              key={x}
              className={`block ${block ? 'block-rotate' : ''}`}
              style={{
                backgroundColor: block ? state.currentBlock.color : 'transparent',
                transform: block ? `translate(${x * 50}px, ${y * 50}px)` : 'translate(0, 0)',
              }}
            />
          ))}
        </div>
      ))}
      <div className="text-center text-lg">{state.score}</div>
      {state.gameOver && <div className="text-center text-lg game-over">Game Over!</div>}
    </div>
  );
}

export default App;