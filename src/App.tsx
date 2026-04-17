import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, ArrowDown } from 'lucide-react';

const App = () => {
  const [board, setBoard] = useState(Array(20).fill(0).map(() => Array(10).fill(0)));
  const [currentBlock, setCurrentBlock] = useState(null);
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const tetrominoes = [
    [
      [1, 1, 1, 1]
    ],
    [
      [1, 1],
      [1, 1]
    ],
    [
      [1, 1, 0],
      [0, 1, 1]
    ],
    [
      [0, 1, 1],
      [1, 1, 0]
    ],
    [
      [1, 1, 1],
      [0, 1, 0]
    ],
    [
      [1, 1, 1],
      [1, 0, 0]
    ],
    [
      [1, 1, 1],
      [0, 0, 1]
    ]
  ];

  const createNewBlock = () => {
    const randomIndex = Math.floor(Math.random() * tetrominoes.length);
    const newBlock = tetrominoes[randomIndex];
    setCurrentBlock({ block: newBlock, x: 3, y: 0 });
  };

  const moveBlock = (dx, dy) => {
    if (!currentBlock) return;
    const newX = currentBlock.x + dx;
    const newY = currentBlock.y + dy;
    if (newX < 0 || newX + currentBlock.block[0].length > 10 || newY < 0 || newY + currentBlock.block.length > 20) return;
    for (let i = 0; i < currentBlock.block.length; i++) {
      for (let j = 0; j < currentBlock.block[i].length; j++) {
        if (currentBlock.block[i][j] === 1 && board[newY + i][newX + j] === 1) return;
      }
    }
    setCurrentBlock({ block: currentBlock.block, x: newX, y: newY });
  };

  const rotateBlock = () => {
    if (!currentBlock) return;
    const rotatedBlock = currentBlock.block.map((row, index) => {
      return row.slice().reverse();
    }).reverse();
    const newX = currentBlock.x;
    const newY = currentBlock.y;
    if (newX + rotatedBlock[0].length > 10 || newY + rotatedBlock.length > 20) return;
    for (let i = 0; i < rotatedBlock.length; i++) {
      for (let j = 0; j < rotatedBlock[i].length; j++) {
        if (rotatedBlock[i][j] === 1 && board[newY + i][newX + j] === 1) return;
      }
    }
    setCurrentBlock({ block: rotatedBlock, x: newX, y: newY });
  };

  const fixBlock = () => {
    if (!currentBlock) return;
    for (let i = 0; i < currentBlock.block.length; i++) {
      for (let j = 0; j < currentBlock.block[i].length; j++) {
        if (currentBlock.block[i][j] === 1) {
          board[currentBlock.y + i][currentBlock.x + j] = 1;
        }
      }
    }
    checkLines();
    createNewBlock();
  };

  const checkLines = () => {
    let newBoard = board.slice();
    let newLines = 0;
    for (let i = 0; i < 20; i++) {
      let isFull = true;
      for (let j = 0; j < 10; j++) {
        if (newBoard[i][j] === 0) {
          isFull = false;
          break;
        }
      }
      if (isFull) {
        newBoard.splice(i, 1);
        newBoard.unshift(Array(10).fill(0));
        newLines++;
        i--;
      }
    }
    setBoard(newBoard);
    setLines(lines + newLines);
    setScore(score + newLines * 100);
  };

  useEffect(() => {
    createNewBlock();
    const interval = setInterval(() => {
      if (currentBlock) {
        moveBlock(0, 1);
      }
    }, 500);
    return () => clearInterval(interval);
  }, [currentBlock]);

  useEffect(() => {
    if (gameOver) {
      alert(`Game Over! Final Score: ${score}`);
    }
  }, [gameOver]);

  const handleKeyPress = (e) => {
    switch (e.key) {
      case 'ArrowLeft':
        moveBlock(-1, 0);
        break;
      case 'ArrowRight':
        moveBlock(1, 0);
        break;
      case 'ArrowDown':
        moveBlock(0, 1);
        break;
      case 'ArrowUp':
        rotateBlock();
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [currentBlock]);

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="w-1/2 h-1/2 border border-gray-400 flex flex-col">
        <div className="h-1/6 flex justify-between items-center">
          <div className="text-lg font-bold">Score: {score}</div>
          <div className="text-lg font-bold">Lines: {lines}</div>
        </div>
        <div className="h-5/6 flex justify-center items-center">
          {board.map((row, index) => (
            <div key={index} className="flex justify-center items-center">
              {row.map((cell, cellIndex) => (
                <div key={cellIndex} className={`w-10 h-10 ${cell === 1 ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
              ))}
            </div>
          ))}
          {currentBlock && (
            <div
              style={{
                position: 'absolute',
                left: `${currentBlock.x * 40}px`,
                top: `${currentBlock.y * 40}px`
              }}
            >
              {currentBlock.block.map((row, index) => (
                <div key={index} className="flex justify-center items-center">
                  {row.map((cell, cellIndex) => (
                    <div key={cellIndex} className={`w-10 h-10 ${cell === 1 ? 'bg-red-500' : 'bg-gray-200'}`}></div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="h-1/6 flex justify-between items-center">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => moveBlock(-1, 0)}>
            <ArrowLeft size={20} />
          </button>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => moveBlock(1, 0)}>
            <ArrowRight size={20} />
          </button>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => moveBlock(0, 1)}>
            <ArrowDown size={20} />
          </button>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={rotateBlock}>
            Rotate
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;