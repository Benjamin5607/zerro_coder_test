import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const App = () => {
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [currentBlock, setCurrentBlock] = useState({
    shape: 'I',
    color: 'blue',
    x: 5,
    y: 0,
  });
  const [blocks, setBlocks] = useState([]);
  const [moveDirection, setMoveDirection] = useState('right');

  const blockShapes = {
    I: [
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    J: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
      [0, 0, 0],
    ],
    L: [
      [0, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
      [0, 0, 0],
    ],
    O: [
      [1, 1],
      [1, 1],
      [0, 0],
      [0, 0],
    ],
    S: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
      [0, 0, 0],
    ],
    T: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
      [0, 0, 0],
    ],
    Z: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
      [0, 0, 0],
    ],
  };

  const scoreMap = {
    I: 1,
    J: 1,
    L: 1,
    O: 2,
    S: 2,
    T: 1,
    Z: 2,
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!gameOver) {
        moveBlock();
      }
    }, 1000);
    return () => clearInterval(intervalId);
  }, [gameOver]);

  const moveBlock = () => {
    const newX = currentBlock.x + (moveDirection === 'right' ? 1 : -1);
    const newBlocks = [...blocks];
    newBlocks.forEach((block, index) => {
      if (newBlocks[index].x === newX && newBlocks[index].y === currentBlock.y) {
        setGameOver(true);
      }
    });
    if (!newBlocks.some((block) => block.x === newX && block.y === currentBlock.y)) {
      setCurrentBlock({ ...currentBlock, x: newX });
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowLeft') {
      setMoveDirection('left');
    } else if (event.key === 'ArrowRight') {
      setMoveDirection('right');
    }
  };

  const handleKeyUp = () => {
    setMoveDirection('right');
  };

  const handleClear = () => {
    setScore(score + scoreMap[currentBlock.shape]);
    setCurrentBlock({
      shape: getRandomBlockShape(),
      color: getRandomColor(),
      x: 5,
      y: 0,
    });
    setBlocks([]);
  };

  const getRandomBlockShape = () => {
    const shapes = Object.keys(blockShapes);
    return shapes[Math.floor(Math.random() * shapes.length)];
  };

  const getRandomColor = () => {
    const colors = ['blue', 'red', 'green', 'yellow', 'purple'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleRestart = () => {
    setGameOver(false);
    setScore(0);
    setCurrentBlock({
      shape: getRandomBlockShape(),
      color: getRandomColor(),
      x: 5,
      y: 0,
    });
    setBlocks([]);
  };

  return (
    <div
      className="w-full h-screen flex justify-center items-center"
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
    >
      <div
        className="w-1/2 h-1/2 flex justify-center items-center"
        style={{
          border: '1px solid black',
        }}
      >
        {blocks.map((block, index) => (
          <div
            key={index}
            className={`w-4 h-4 ${block.color} ml-${block.x} mt-${block.y}`}
            style={{
              position: 'absolute',
            }}
          />
        ))}
        <div
          className={`w-4 h-4 ${currentBlock.color} ml-${currentBlock.x} mt-${currentBlock.y}`}
          style={{
            position: 'absolute',
          }}
        />
      </div>
      <div
        className="w-1/2 h-1/2 flex justify-center items-center"
        style={{
          border: '1px solid black',
        }}
      >
        <p className="text-2xl font-bold">Score: {score}</p>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleClear}
        >
          Clear
        </button>
        <button
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleRestart}
        >
          Restart
        </button>
      </div>
    </div>
  );
};

export default App;