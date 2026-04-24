import React, { useState, useEffect } from 'react';
import { Play } from 'lucide-react';

const GRID_WIDTH = 10;
const GRID_HEIGHT = 20;
const BLOCK_SIZE = 20;
const COLORS = ['#FF6B6B', '#6BCB77', '#4D96FF', '#FFC75F', '#9D4EDD'];
const SHAPES = [
  [[0, 0], [1, 0], [2, 0], [3, 0]], // I
  [[0, 0], [1, 0], [0, 1], [1, 1]], // O
  [[0, 0], [1, 0], [2, 0], [2, 1]], // J
  [[0, 1], [1, 1], [2, 1], [2, 0]], // L
  [[1, 0], [2, 0], [0, 1], [1, 1]], // S
  [[0, 0], [1, 0], [1, 1], [2, 1]], // Z
  [[0, 1], [1, 1], [1, 0], [2, 0]] // T
];

const generateBlock = (id, shape) => ({
  id,
  x: Math.floor(Math.random() * (GRID_WIDTH - shape[0].length)),
  y: 0,
  color: COLORS[Math.floor(Math.random() * COLORS.length)],
  shape
});

const checkCollision = (blocks, newBlock) => {
  for (let i = 0; i < blocks.length; i++) {
    for (let j = 0; j < blocks[i].shape.length; j++) {
      if (
        blocks[i].x + blocks[i].shape[j][0] === newBlock.x + newBlock.shape[0][0] &&
        blocks[i].y + blocks[i].shape[j][1] === newBlock.y + newBlock.shape[0][1]
      ) {
        return true;
      }
    }
  }
  return false;
};

const checkGameOver = (blocks) => {
  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i].y + blocks[i].shape.length > GRID_HEIGHT) {
      return true;
    }
  }
  return false;
};

const updateScore = (score, blocks) => {
  let newScore = score;
  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i].y + blocks[i].shape.length > GRID_HEIGHT) {
      newScore++;
    }
  }
  return newScore;
};

export default function App() {
  const [blocks, setBlocks] = useState([]);
  const [running, setRunning] = useState(false);
  const [currentBlock, setCurrentBlock] = useState(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      setBlocks((prev) => {
        if (!prev) return [];
        const newBlocks = prev.map((b) => ({ ...b, y: b.y + 1 }));
        const falling = newBlocks.filter((b) => b.y < GRID_HEIGHT);
        if (currentBlock && currentBlock.y + currentBlock.shape.length > GRID_HEIGHT) {
          // Game Over
          setRunning(false);
          return falling;
        }
        if (!currentBlock) {
          const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
          const newBlock = generateBlock(Date.now(), shape);
          setCurrentBlock(newBlock);
          return [...falling, newBlock];
        }
        const newBlock = { ...currentBlock, y: currentBlock.y + 1 };
        if (checkCollision(blocks, newBlock)) {
          setRunning(false);
          return falling;
        }
        setCurrentBlock(newBlock);
        return [...falling, newBlock];
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [running, currentBlock, blocks]);

  const handleStart = () => {
    setRunning(true);
    setBlocks([]);
    setScore(0);
  };

  const handleMoveLeft = () => {
    if (currentBlock) {
      const newBlock = { ...currentBlock, x: currentBlock.x - 1 };
      if (newBlock.x < 0) return;
      if (checkCollision(blocks, newBlock)) return;
      setCurrentBlock(newBlock);
    }
  };

  const handleMoveRight = () => {
    if (currentBlock) {
      const newBlock = { ...currentBlock, x: currentBlock.x + 1 };
      if (newBlock.x + newBlock.shape[0].length > GRID_WIDTH) return;
      if (checkCollision(blocks, newBlock)) return;
      setCurrentBlock(newBlock);
    }
  };

  const handleMoveDown = () => {
    if (currentBlock) {
      const newBlock = { ...currentBlock, y: currentBlock.y + 1 };
      if (newBlock.y + newBlock.shape.length > GRID_HEIGHT) {
        setRunning(false);
        return;
      }
      if (checkCollision(blocks, newBlock)) {
        setRunning(false);
        return;
      }
      setCurrentBlock(newBlock);
    }
  };

  const handleRotate = () => {
    if (currentBlock) {
      const newShape = currentBlock.shape.slice().reverse().map((point) => [point[1], -point[0]]);
      const newBlock = { ...currentBlock, shape: newShape };
      setCurrentBlock(newBlock);
    }
  };

  const handleScore = () => {
    setScore(updateScore(score, blocks));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="mb-4">
        <button
          onClick={handleStart}
          className="flex items-center px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition"
        >
          <Play className="mr-2" size={20} />
          Start
        </button>
      </div>
      <div
        className="relative"
        style={{
          width: `${GRID_WIDTH * BLOCK_SIZE}px`,
          height: `${GRID_HEIGHT * BLOCK_SIZE}px`,
          border: '2px solid white',
        }}
      >
        {blocks?.length &&
          blocks.map((block) => (
            <div
              key={block.id}
              className="absolute"
              style={{
                width: `${BLOCK_SIZE}px`,
                height: `${BLOCK_SIZE}px`,
                left: `${block.x * BLOCK_SIZE}px`,
                top: `${block.y * BLOCK_SIZE}px`,
                backgroundColor: block.color,
              }}
            />
          ))}
        {currentBlock && currentBlock.shape.map((point) => (
          <div
            key={`${currentBlock.id}-${point[0]}-${point[1]}`}
            className="absolute"
            style={{
              width: `${BLOCK_SIZE}px`,
              height: `${BLOCK_SIZE}px`,
              left: `${(currentBlock.x + point[0]) * BLOCK_SIZE}px`,
              top: `${(currentBlock.y + point[1]) * BLOCK_SIZE}px`,
              backgroundColor: currentBlock.color,
            }}
          />
        ))}
      </div>
      <div className="mt-4">
        <button onClick={handleMoveLeft} className="mr-2">Left</button>
        <button onClick={handleMoveRight} className="mr-2">Right</button>
        <button onClick={handleMoveDown} className="mr-2">Down</button>
        <button onClick={handleRotate}>Rotate</button>
      </div>
      <div className="mt-4">Score: {score}</div>
      <div className="mt-4">
        <button onClick={handleScore}>Increase Score</button>
      </div>
    </div>
  );
}
