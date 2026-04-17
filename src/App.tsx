import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaArrowRight, FaRotate } from 'lucide-react';

const TetrisGame = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [currentBlock, setCurrentBlock] = useState(null);
  const [nextBlock, setNextBlock] = useState(null);
  const [score, setScore] = useState(0);
  const [records, setRecords] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [grid, setGrid] = useState([]);

  useEffect(() => {
    if (!gameStarted) {
      setGrid([]);
      setScore(0);
      setRecords([]);
      setGameOver(false);
      setGameStarted(true);
    }

    if (!currentBlock) {
      const newBlock = generateNewBlock();
      setCurrentBlock(newBlock);
      setNextBlock(generateNewBlock());
    }

    if (currentBlock) {
      const newGrid = moveBlock(currentBlock, grid);
      setGrid(newGrid);
    }

    if (gameOver) {
      setGameOver(false);
      setScore(0);
      setGrid([]);
    }
  }, [currentBlock, grid, gameOver]);

  const generateNewBlock = () => {
    const blockType = Math.floor(Math.random() * 7);
    const block = {
      type: blockType,
      x: 5,
      y: 0,
      rotation: 0,
    };
    return block;
  };

  const moveBlock = (block, grid) => {
    const newGrid = [...grid];
    for (let i = 0; i < block.y + 1; i++) {
      for (let j = 0; j < 10; j++) {
        if (newGrid[i][j] === 1 && (j === block.x || j === block.x + 1 || j === block.x - 1)) {
          return grid;
        }
      }
    }
    for (let i = 0; i < block.y + 1; i++) {
      for (let j = 0; j < 10; j++) {
        if (newGrid[i][j] === 1 && (j === block.x + 2 || j === block.x - 2)) {
          return grid;
        }
      }
    }
    newGrid[block.y][block.x] = 1;
    newGrid[block.y + 1][block.x] = 1;
    newGrid[block.y + 1][block.x + 1] = 1;
    newGrid[block.y + 1][block.x - 1] = 1;
    return newGrid;
  };

  const handleMoveLeft = () => {
    const newBlock = { ...currentBlock };
    newBlock.x -= 1;
    const newGrid = moveBlock(newBlock, grid);
    setCurrentBlock(newBlock);
    setGrid(newGrid);
  };

  const handleMoveRight = () => {
    const newBlock = { ...currentBlock };
    newBlock.x += 1;
    const newGrid = moveBlock(newBlock, grid);
    setCurrentBlock(newBlock);
    setGrid(newGrid);
  };

  const handleRotate = () => {
    const newBlock = { ...currentBlock };
    newBlock.rotation += 1;
    const newGrid = moveBlock(newBlock, grid);
    setCurrentBlock(newBlock);
    setGrid(newGrid);
  };

  const handleReset = () => {
    setGrid([]);
    setScore(0);
    setRecords([]);
    setGameOver(false);
    setGameStarted(true);
  };

  const handleScoreUpdate = () => {
    setScore(score + 1);
  };

  const handleRecordUpdate = () => {
    const newRecords = [...records];
    newRecords.push(score);
    newRecords.sort((a, b) => b - a);
    newRecords.splice(10);
    setRecords(newRecords);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="w-full max-w-md">
        <div className="grid grid-cols-10 gap-2 h-40">
          {grid.map((row, rowIndex) => (
            <div key={rowIndex} className="flex flex-row">
              {row.map((cell, cellIndex) => (
                <div
                  key={cellIndex}
                  className={`w-4 h-4 bg-gray-200 rounded-lg ${
                    cell === 1 ? 'bg-red-500' : ''
                  }`}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="flex flex-row justify-between mt-4">
          <div className="text-lg font-bold">Score: {score}</div>
          <div className="text-lg font-bold">Records: {records.length}</div>
        </div>
        <div className="flex flex-row justify-between mt-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleMoveLeft}
          >
            <FaArrowLeft />
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleMoveRight}
          >
            <FaArrowRight />
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleRotate}
          >
            <FaRotate />
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default TetrisGame;