import React, { useState, useEffect } from 'react';
import { Play } from 'lucide-react';

const BLOCK_SIZE = 100;
const COLORS = ['#FFFF00']; // 노란색
const DIRECTIONS = {
  UP: [0, -1],
  DOWN: [0, 1],
  LEFT: [-1, 0],
  RIGHT: [1, 0],
};

const generateBlock = () => ({
  x: 0,
  y: 0,
  color: COLORS[0],
  rotation: 0,
});

export default function App() {
  const [block, setBlock] = useState(generateBlock());
  const [direction, setDirection] = useState(DIRECTIONS.DOWN);

  const handleKeyPress = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowUp':
        setBlock((prevBlock) => ({ ...prevBlock, rotation: (prevBlock.rotation + 90) % 360 }));
        break;
      case 'ArrowDown':
        setBlock((prevBlock) => ({ ...prevBlock, x: prevBlock.x + direction[0], y: prevBlock.y + direction[1] }));
        break;
      case 'ArrowLeft':
        setDirection(DIRECTIONS.LEFT);
        break;
      case 'ArrowRight':
        setDirection(DIRECTIONS.RIGHT);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [direction]);

  return (
    <div className="flex justify-center items-center h-screen" onKeyPress={handleKeyPress}>
      <div
        className="absolute"
        style={{
          width: `${BLOCK_SIZE}px`,
          height: `${BLOCK_SIZE}px`,
          left: `${block.x * BLOCK_SIZE}px`,
          top: `${block.y * BLOCK_SIZE}px`,
          backgroundColor: block.color,
          transform: `rotate(${block.rotation}deg)`,
        }}
      />
    </div>
  );
}