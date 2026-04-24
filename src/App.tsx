import React, { useState, useEffect } from 'react';
import { Play } from 'lucide-react';

const BLOCK_SIZE = 100;
const COLORS = ['#FFFF00']; // 노란색

const generateBlock = () => ({
  x: 0,
  y: 0,
  color: COLORS[0],
});

export default function App() {
  const [block, setBlock] = useState(generateBlock());

  return (
    <div className="flex justify-center items-center h-screen">
      <div
        className="absolute"
        style={{
          width: `${BLOCK_SIZE}px`,
          height: `${BLOCK_SIZE}px`,
          left: `${block.x * BLOCK_SIZE}px`,
          top: `${block.y * BLOCK_SIZE}px`,
          backgroundColor: block.color,
        }}
      />
    </div>
  );
}