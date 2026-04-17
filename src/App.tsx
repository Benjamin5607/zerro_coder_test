import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaArrowRight, FaArrowDown, FaArrowUp } from 'lucide-react';

const App = () => {
  const [blocks, setBlocks] = useState({
    currentBlock: {
      type: 'I',
      x: 5,
      y: 0,
      rotation: 0,
    },
    grid: Array(20).fill(0).map(() => Array(10).fill(0)),
  });

  const BLOCK_SIZES = {
    I: [4, 1],
    J: [3, 2],
    L: [3, 2],
    O: [2, 2],
    S: [3, 2],
    T: [3, 2],
    Z: [3, 2],
  };

  const rotateBlock = (block) => {
    const newRotation = (block.rotation + 1) % 4;
    const newBlock = {
      ...block,
      rotation: newRotation,
    };

    if (isRotationPossible(newBlock, blocks.grid)) {
      return newBlock;
    }

    return {
      ...block,
      rotation: (block.rotation - 1 + 4) % 4,
    };
  };

  const moveBlock = (block, dx, dy) => {
    const newBlock = {
      ...block,
      x: block.x + dx,
      y: block.y + dy,
    };

    if (newBlock.x < 0 || newBlock.x + BLOCK_SIZES[block.type][0] > 10) {
      return block;
    }

    if (newBlock.y < 0 || newBlock.y + BLOCK_SIZES[block.type][1] > 20) {
      return block;
    }

    return newBlock;
  };

  const dropBlock = (block) => {
    const newBlock = {
      ...block,
      y: block.y + 1,
    };

    if (newBlock.y + BLOCK_SIZES[block.type][1] > 20) {
      return block;
    }

    return newBlock;
  };

  const checkCollision = (block, grid) => {
    for (let i = 0; i < BLOCK_SIZES[block.type][1]; i++) {
      for (let j = 0; j < BLOCK_SIZES[block.type][0]; j++) {
        if (grid[block.y + i][block.x + j] === 1) {
          return true;
        }
      }
    }

    return false;
  };

  const isRotationPossible = (block, grid) => {
    const newBlock = rotateBlock(block);

    for (let i = 0; i < BLOCK_SIZES[newBlock.type][1]; i++) {
      for (let j = 0; j < BLOCK_SIZES[newBlock.type][0]; j++) {
        if (newBlock.y + i < 0 || newBlock.y + i + BLOCK_SIZES[newBlock.type][1] > 20) {
          return false;
        }

        if (newBlock.x + j < 0 || newBlock.x + j + BLOCK_SIZES[newBlock.type][0] > 10) {
          return false;
        }

        if (grid[newBlock.y + i][newBlock.x + j] === 1) {
          return false;
        }
      }
    }

    return true;
  };

  const updateBlockPosition = (block, dx, dy) => {
    const newBlock = moveBlock(block, dx, dy);

    if (checkCollision(newBlock, blocks.grid)) {
      return block;
    }

    return newBlock;
  };

  const updateBlockDrop = (block) => {
    const newBlock = dropBlock(block);

    if (checkCollision(newBlock, blocks.grid)) {
      return block;
    }

    return newBlock;
  };

  const handleUserInput = (event) => {
    switch (event.key) {
      case 'ArrowLeft':
        setBlocks((prevBlocks) => ({
          ...prevBlocks,
          currentBlock: updateBlockPosition(prevBlocks.currentBlock, -1, 0),
        }));
        break;
      case 'ArrowRight':
        setBlocks((prevBlocks) => ({
          ...prevBlocks,
          currentBlock: updateBlockPosition(prevBlocks.currentBlock, 1, 0),
        }));
        break;
      case 'ArrowDown':
        setBlocks((prevBlocks) => ({
          ...prevBlocks,
          currentBlock: updateBlockDrop(prevBlocks.currentBlock),
        }));
        break;
      case 'ArrowUp':
        setBlocks((prevBlocks) => ({
          ...prevBlocks,
          currentBlock: rotateBlock(prevBlocks.currentBlock),
        }));
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleUserInput);

    return () => {
      document.removeEventListener('keydown', handleUserInput);
    };
  }, []);

  return (
    <div className="grid grid-cols-10 gap-1">
      {blocks.grid.map((row, rowIndex) => (
        <div key={rowIndex} className="flex">
          {row.map((cell, cellIndex) => (
            <div
              key={cellIndex}
              className={`w-4 h-4 bg-gray-300 ${cell === 1 ? 'bg-red-500' : ''}`}
            />
          ))}
        </div>
      ))}
      <div
        className={`absolute top-0 left-0 w-4 h-4 bg-gray-300 ${blocks.currentBlock.type === 'I' ? 'bg-blue-500' : ''}`}
        style={{
          transform: `translate(${blocks.currentBlock.x * 40}px, ${blocks.currentBlock.y * 20}px) rotate(${blocks.currentBlock.rotation * 90}deg)`,
        }}
      />
      <div className="absolute top-10 left-10">
        <FaArrowLeft className="text-2xl" />
        <FaArrowRight className="text-2xl" />
        <FaArrowDown className="text-2xl" />
        <FaArrowUp className="text-2xl" />
      </div>
    </div>
  );
};

export default App;