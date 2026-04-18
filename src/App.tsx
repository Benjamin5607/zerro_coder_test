import React, { useState, useEffect } from 'react';
import { ArrowDown } from 'lucide-react';

const CONTAINER_WIDTH = 256;
const CONTAINER_HEIGHT = 384;
const BLOCK_SIZE = 48;
const FALL_SPEED = 2;
const UPDATE_INTERVAL = 50;
const BLOCK_COUNT = 5;

const App = () => {
  const [blocks, setBlocks] = useState(
    Array.from({ length: BLOCK_COUNT }, (_, i) => ({
      id: i,
      top: Math.random() * (CONTAINER_HEIGHT - BLOCK_SIZE),
      left: Math.random() * (CONTAINER_WIDTH - BLOCK_SIZE),
    }))
  );
  const [running, setRunning] = useState(true);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setBlocks(prev =>
        prev.map(b => {
          let newTop = b.top + FALL_SPEED;
          if (newTop > CONTAINER_HEIGHT - BLOCK_SIZE) {
            newTop = 0;
            return { ...b, top: newTop, left: Math.random() * (CONTAINER_WIDTH - BLOCK_SIZE) };
          }
          return { ...b, top: newTop };
        })
      );
    }, UPDATE_INTERVAL);
    return () => clearInterval(id);
  }, [running]);

  return (
    <div className="flex flex-col items-center mt-8">
      <div
        className="relative bg-gray-200 border-2 border-gray-400"
        style={{ width: CONTAINER_WIDTH, height: CONTAINER_HEIGHT }}
      >
        {blocks.map(b => (
          <div
            key={b.id}
            className="absolute bg-blue-500"
            style={{
              width: BLOCK_SIZE,
              height: BLOCK_SIZE,
              top: b.top,
              left: b.left,
            }}
          />
        ))}
      </div>
      <button
        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 flex items-center"
        onClick={() => setRunning(!running)}
      >
        {running ? <ArrowDown className="mr-2" /> : null}
        {running ? 'Pause' : 'Resume'}
      </button>
    </div>
  );
};

export default App;