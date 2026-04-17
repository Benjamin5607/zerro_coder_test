import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaArrowRight, FaRotate } from 'lucide-react';

const TetrisGame = () => {
  const [board, setBoard] = useState([]);
  const [currentBlock, setCurrentBlock] = useState({
    shape: 'I',
    color: 'red',
    x: 5,
    y: 0,
  });
  const [score, setScore] = useState(0);
  const [record, setRecord] = useState({});

  const blockShapes = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
  const blockColors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink'];

  useEffect(() => {
    const initBoard = Array(20).fill(0).map(() => Array(10).fill(0));
    setBoard(initBoard);
  }, []);

  const createBlock = () => {
    const shape = blockShapes[Math.floor(Math.random() * blockShapes.length)];
    const color = blockColors[Math.floor(Math.random() * blockColors.length)];
    const x = Math.floor(Math.random() * 10);
    const y = 0;
    setCurrentBlock({ shape, color, x, y });
  };

  const moveBlock = (direction) => {
    if (direction === 'left' && currentBlock.x > 0) {
      setCurrentBlock((prevBlock) => ({ ...prevBlock, x: prevBlock.x - 1 }));
    } else if (direction === 'right' && currentBlock.x < 9) {
      setCurrentBlock((prevBlock) => ({ ...prevBlock, x: prevBlock.x + 1 }));
    }
  };

  const rotateBlock = () => {
    const shape = currentBlock.shape;
    const color = currentBlock.color;
    const x = currentBlock.x;
    const y = currentBlock.y;
    if (shape === 'I') {
      setCurrentBlock({ shape: 'I', color, x, y });
    } else if (shape === 'J') {
      setCurrentBlock({ shape: 'L', color, x, y });
    } else if (shape === 'L') {
      setCurrentBlock({ shape: 'J', color, x, y });
    } else if (shape === 'O') {
      setCurrentBlock({ shape: 'O', color, x, y });
    } else if (shape === 'S') {
      setCurrentBlock({ shape: 'Z', color, x, y });
    } else if (shape === 'T') {
      setCurrentBlock({ shape: 'T', color, x, y });
    } else if (shape === 'Z') {
      setCurrentBlock({ shape: 'S', color, x, y });
    }
  };

  const fitBlock = () => {
    const boardCopy = [...board];
    const blockCopy = { ...currentBlock };
    if (blockCopy.x >= 0 && blockCopy.x <= 9 && blockCopy.y >= 0 && blockCopy.y <= 19) {
      boardCopy[blockCopy.y][blockCopy.x] = 1;
      setBoard(boardCopy);
      createBlock();
    }
  };

  const calculateScore = () => {
    const score = currentBlock.shape === 'I' ? 10 : 5;
    setScore((prevScore) => prevScore + score);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-96 h-96 border-2 border-gray-400">
        <div className="w-full h-full grid grid-cols-10 grid-rows-20">
          {board.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-center items-center">
              {row.map((cell, cellIndex) => (
                <div
                  key={cellIndex}
                  className={`w-4 h-4 ${cell === 1 ? 'bg-gray-400' : 'bg-gray-200'} ${currentBlock.x === cellIndex && currentBlock.y === rowIndex ? 'bg-red-400' : ''}`}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="flex justify-center items-center mt-4">
          <button className="px-4 py-2 bg-blue-400 hover:bg-blue-500 text-white rounded" onClick={createBlock}>
            <FaArrowLeft />
          </button>
          <button className="px-4 py-2 bg-green-400 hover:bg-green-500 text-white rounded" onClick={() => moveBlock('left')}>
            <FaArrowLeft />
          </button>
          <button className="px-4 py-2 bg-green-400 hover:bg-green-500 text-white rounded" onClick={() => moveBlock('right')}>
            <FaArrowRight />
          </button>
          <button className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-white rounded" onClick={rotateBlock}>
            <FaRotate />
          </button>
          <button className="px-4 py-2 bg-red-400 hover:bg-red-500 text-white rounded" onClick={fitBlock}>
            맞추기
          </button>
        </div>
        <div className="flex justify-center items-center mt-4">
          <p className="text-lg font-bold">점수: {score}</p>
        </div>
      </div>
    </div>
  );
};

export default TetrisGame;