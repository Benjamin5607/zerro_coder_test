import React, { useState, useEffect } from 'react';

const Tetris = () => {
  // 게임 상태
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [grid, setGrid] = useState(Array(20).fill(null).map(() => Array(10).fill(null)));
  const [currentBlock, setCurrentBlock] = useState(null);
  const [nextBlock, setNextBlock] = useState(null);
  const [blockX, setBlockX] = useState(0);
  const [blockY, setBlockY] = useState(0);

  // 블록 생성
  const createBlock = () => {
    const blockTypes = [
      [[1, 1], [1, 1]],
      [[1, 1, 1], [0, 1, 0]],
      [[1, 1, 1], [1, 0, 0]],
      [[1, 1, 1], [0, 0, 1]],
      [[1, 1, 0], [0, 1, 1]],
      [[0, 1, 1], [1, 1, 0]],
      [[1, 0, 0], [1, 1, 1]],
    ];
    const randomIndex = Math.floor(Math.random() * blockTypes.length);
    return blockTypes[randomIndex];
  };

  // 블록 이동
  const moveBlock = (dx, dy) => {
    if (gameOver) return;
    let newX = blockX + dx;
    let newY = blockY + dy;
    if (newX < 0 || newX + currentBlock[0].length > 10) return;
    if (newY < 0 || newY + currentBlock.length > 20) return;
    for (let i = 0; i < currentBlock.length; i++) {
      for (let j = 0; j < currentBlock[i].length; j++) {
        if (currentBlock[i][j] === 1) {
          if (grid[newY + i] && grid[newY + i][newX + j] !== undefined && grid[newY + i][newX + j] === 1) return;
        }
      }
    }
    setBlockX(newX);
    setBlockY(newY);
  };

  // 블록 회전
  const rotateBlock = () => {
    if (gameOver) return;
    const newBlock = currentBlock.map((row) => row.slice().reverse());
    setBlockX(blockX);
    setBlockY(blockY);
    setCurrentBlock(newBlock);
  };

  // 게임 시작
  const startGame = () => {
    setGameOver(false);
    setScore(0);
    setGrid(Array(20).fill(null).map(() => Array(10).fill(null)));
    setCurrentBlock(createBlock());
    setNextBlock(createBlock());
    setBlockX(0);
    setBlockY(0);
  };

  // 게임 종료
  const endGame = () => {
    setGameOver(true);
  };

  // 점수 계산
  const calculateScore = () => {
    let newScore = score;
    for (let i = 0; i < 20; i++) {
      let isFullRow = true;
      for (let j = 0; j < 10; j++) {
        if (grid[i][j] !== 1) {
          isFullRow = false;
          break;
        }
      }
      if (isFullRow) {
        newScore += 100;
        grid.splice(i, 1);
        grid.unshift(Array(10).fill(null));
      }
    }
    setScore(newScore);
  };

  // 게임 루프
  useEffect(() => {
    if (gameOver) return;
    const intervalId = setInterval(() => {
      if (blockY + currentBlock.length >= 20) {
        endGame();
        return;
      }
      for (let i = 0; i < currentBlock.length; i++) {
        for (let j = 0; j < currentBlock[i].length; j++) {
          if (currentBlock[i][j] === 1) {
            if (grid[blockY + i + 1] && grid[blockY + i + 1][blockX + j] !== undefined && grid[blockY + i + 1][blockX + j] === 1) {
              endGame();
              return;
            }
          }
        }
      }
      setBlockY(blockY + 1);
    }, 500);
    return () => clearInterval(intervalId);
  }, [gameOver, blockY, currentBlock, grid]);

  // 블록 생성 및 이동
  useEffect(() => {
    if (gameOver) return;
    if (!currentBlock) {
      setCurrentBlock(createBlock());
    }
    if (blockY + currentBlock.length >= 20) {
      for (let i = 0; i < currentBlock.length; i++) {
        for (let j = 0; j < currentBlock[i].length; j++) {
          if (currentBlock[i][j] === 1) {
            grid[blockY + i][blockX + j] = 1;
          }
        }
      }
      setCurrentBlock(nextBlock);
      setNextBlock(createBlock());
      setBlockX(0);
      setBlockY(0);
      calculateScore();
    }
  }, [gameOver, currentBlock, blockY, grid, nextBlock]);

  // 사용자 입력 처리
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      moveBlock(-1, 0);
    } else if (e.key === 'ArrowRight') {
      moveBlock(1, 0);
    } else if (e.key === 'ArrowDown') {
      moveBlock(0, 1);
    } else if (e.key === 'ArrowUp') {
      rotateBlock();
    }
  };

  // 렌더링
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <div className="grid grid-cols-10 grid-rows-20 gap-1 w-64 h-64 border border-gray-400">
        {grid.map((row, y) => row.map((cell, x) => (
          <div key={`${y},${x}`} className={`w-6 h-6 ${cell === 1 ? 'bg-blue-500' : 'bg-gray-200'}`} />
        )))}
        {currentBlock && currentBlock.map((row, y) => row.map((cell, x) => (
          <div key={`${y},${x}`} className={`w-6 h-6 ${cell === 1 ? 'bg-red-500' : 'bg-gray-200'} absolute top-0 left-0 translate-x-${blockX * 8}rem translate-y-${blockY * 8}rem`} />
        )))}
      </div>
      <div className="ml-4">
        <p>Score: {score}</p>
        <p>Next Block:</p>
        <div className="grid grid-cols-3 grid-rows-3 gap-1 w-24 h-24 border border-gray-400">
          {nextBlock && nextBlock.map((row, y) => row.map((cell, x) => (
            <div key={`${y},${x}`} className={`w-6 h-6 ${cell === 1 ? 'bg-green-500' : 'bg-gray-200'}`} />
          )))}
        </div>
        <button className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={startGame}>
          Start Game
        </button>
      </div>
    </div>
  );
};

export default Tetris;