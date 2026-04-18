import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, ArrowDown, ArrowUp } from 'lucide-react';

const App = () => {
  const [board, setBoard] = useState(Array(20).fill(0).map(() => Array(10).fill(0)));
  const [block, setBlock] = useState({
    x: 5,
    y: 0,
    type: 'I',
    rotation: 0,
  });
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [intervalId, setIntervalId] = useState(null);

  const blockTypes = {
    I: [
      [[1, 1, 1, 1]],
      [[1], [1], [1], [1]],
    ],
    J: [
      [[1, 0, 0], [1, 1, 1]],
      [[1, 1], [1, 0], [1, 0]],
      [[1, 1, 1], [0, 0, 1]],
      [[0, 1], [0, 1], [1, 1]],
    ],
    L: [
      [[0, 0, 1], [1, 1, 1]],
      [[1, 1], [0, 1], [0, 1]],
      [[1, 1, 1], [1, 0, 0]],
      [[1, 0], [1, 0], [1, 1]],
    ],
    O: [
      [[1, 1], [1, 1]],
    ],
    S: [
      [[0, 1, 1], [1, 1, 0]],
      [[1, 0], [1, 1], [0, 1]],
    ],
    T: [
      [[0, 1, 0], [1, 1, 1]],
      [[1, 1], [0, 1], [0, 1]],
      [[1, 1, 1], [0, 1, 0]],
      [[1, 0], [1, 1], [1, 0]],
    ],
    Z: [
      [[1, 1, 0], [0, 1, 1]],
      [[0, 1], [1, 1], [1, 0]],
    ],
  };

  const handleKeyPress = (event) => {
    if (event.key === 'ArrowLeft') {
      moveBlock(-1, 0);
    } else if (event.key === 'ArrowRight') {
      moveBlock(1, 0);
    } else if (event.key === 'ArrowDown') {
      moveBlock(0, 1);
    } else if (event.key === 'ArrowUp') {
      rotateBlock();
    }
  };

  const moveBlock = (dx, dy) => {
    const newBlock = { ...block, x: block.x + dx, y: block.y + dy };
    if (isValidBlock(newBlock)) {
      setBlock(newBlock);
    }
  };

  const rotateBlock = () => {
    const newBlock = { ...block, rotation: (block.rotation + 1) % blockTypes[block.type].length };
    if (isValidBlock(newBlock)) {
      setBlock(newBlock);
    }
  };

  const isValidBlock = (block) => {
    const blockType = blockTypes[block.type][block.rotation];
    for (let i = 0; i < blockType.length; i++) {
      for (let j = 0; j < blockType[i].length; j++) {
        if (blockType[i][j] === 1) {
          const x = block.x + j;
          const y = block.y + i;
          if (x < 0 || x >= 10 || y < 0 || y >= 20 || board[y][x] === 1) {
            return false;
          }
        }
      }
    }
    return true;
  };

  const fixBlock = () => {
    const blockType = blockTypes[block.type][block.rotation];
    for (let i = 0; i < blockType.length; i++) {
      for (let j = 0; j < blockType[i].length; j++) {
        if (blockType[i][j] === 1) {
          const x = block.x + j;
          const y = block.y + i;
          board[y][x] = 1;
        }
      }
    }
    setBoard([...board]);
  };

  const checkLines = () => {
    let lines = 0;
    for (let i = 0; i < 20; i++) {
      let fullLine = true;
      for (let j = 0; j < 10; j++) {
        if (board[i][j] === 0) {
          fullLine = false;
          break;
        }
      }
      if (fullLine) {
        lines++;
        board.splice(i, 1);
        board.unshift(Array(10).fill(0));
      }
    }
    setScore(score + lines * lines);
    setLevel(Math.min(level + lines, 10));
  };

  const updateBlock = () => {
    if (block.y + blockTypes[block.type][block.rotation].length >= 20) {
      fixBlock();
      checkLines();
      setBlock({
        x: 5,
        y: 0,
        type: 'I',
        rotation: 0,
      });
    } else {
      moveBlock(0, 1);
    }
  };

  useEffect(() => {
    if (!gameOver) {
      const intervalId = setInterval(updateBlock, 1000 / level);
      setIntervalId(intervalId);
    }
    return () => {
      clearInterval(intervalId);
    };
  }, [gameOver, level]);

  useEffect(() => {
    if (gameOver) {
      clearInterval(intervalId);
    }
  }, [gameOver, intervalId]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [block]);

  if (gameOver) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-800">
        <div className="text-white text-3xl">
          Game Over!
          <br />
          Your score: {score}
          <br />
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => {
              setGameOver(false);
              setScore(0);
              setLevel(1);
              setBoard(Array(20).fill(0).map(() => Array(10).fill(0)));
              setBlock({
                x: 5,
                y: 0,
                type: 'I',
                rotation: 0,
              });
            }}
          >
            Play Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-800">
      <div className="grid grid-cols-10 grid-rows-20 w-64 h-64 bg-gray-700 border-2 border-gray-600">
        {board.map((row, y) => (
          row.map((cell, x) => (
            <div
              key={`${x},${y}`}
              className={`w-8 h-8 ${cell === 1 ? 'bg-blue-500' : 'bg-gray-700'}`}
            />
          ))
        ))}
        {blockTypes[block.type][block.rotation].map((row, y) => (
          row.map((cell, x) => (
            <div
              key={`${x},${y}`}
              className={`w-8 h-8 absolute top-0 left-0 ${cell === 1 ? 'bg-red-500' : 'bg-transparent'} ${
                block.x + x >= 0 && block.x + x < 10 && block.y + y >= 0 && block.y + y < 20
                  ? `translate-x-${(block.x + x) * 8}px translate-y-${(block.y + y) * 8}px`
                  : 'hidden'
              }`}
            />
          ))
        ))}
      </div>
      <div className="text-white text-2xl ml-4">
        Score: {score}
        <br />
        Level: {level}
      </div>
    </div>
  );
};

export default App;