import React, { useState, useEffect } from 'react';
import { Play } from 'lucide-react';

const GRID_WIDTH = 10;
const GRID_HEIGHT = 20;
const BLOCK_SIZE = 20;
const COLORS = ['#FF6B6B', '#6BCB77', '#4D96FF', '#FFC75F', '#9D4EDD'];

const generateBlock = (id) => ({
  id,
  x: Math.floor(Math.random() * GRID_WIDTH),
  y: 0,
  color: COLORS[Math.floor(Math.random() * COLORS.length)],
});

export default function App() {
  const [blocks, setBlocks] = useState([]);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      setBlocks((prev) => {
        const newBlocks = prev.map((b) => ({ ...b, y: b.y + 1 }));
        const falling = newBlocks.filter((b) => b.y < GRID_HEIGHT);
        const newBlock = generateBlock(Date.now());
        return [...falling, newBlock];
      });
    }, 500);
    return () => clearInterval(interval);
  }, [running]);

  const handleStart = () => setRunning(true);

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
      </div>
    </div>
  );
}