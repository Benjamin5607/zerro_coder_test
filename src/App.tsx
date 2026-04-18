import React, { useState, useEffect } from 'react';

const Tetris = () => {
  // 게임 상태
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [grid, setGrid] = useState(Array(20).fill(null).map(() => Array(10).fill(null)));
  const [currentBlock, setCurrentBlock] = useState(null);
  const [nextBlock, setNextBlock] = useState(null);

  // 블록 정의
  const blocks = [
    // I-Shape
    [
      [1, 1, 1, 1]
    ],
    // J-Shape
    [
      [1, 0, 0],
      [1, 1, 1]
    ],
    // L-Shape
    [
      [0, 0, 1],
      [1, 1, 1]
    ],
    // O-Shape
    [
      [1, 1],
      [1, 1]
    ],
    // S-Shape
    [
      [0, 1, 1],
      [1, 1, 0]
    ],
    // T-Shape
    [
      [0, 1, 0],
      [1, 1, 1]
    ],
    // Z-Shape
    [
      [1, 1, 0],
      [0, 1, 1]
    ]
  ];

  // 게임 시작
  const startGame = () => {
    setGameOver(false);
    setScore(0);
    setLevel(1);
    setGrid(Array(20).fill(null).map(() => Array(10).fill(null)));
    spawnBlock();
  };

  // 블록 생성
  const spawnBlock = () => {
    const randomIndex = Math.floor(Math.random() * blocks.length);
    const block = blocks[randomIndex];
    setCurrentBlock(block);
    setNextBlock(blocks[(randomIndex + 1) % blocks.length]);
  };

  // 블록 회전
  const rotateBlock = () => {
    if (!currentBlock) return;
    const rotatedBlock = currentBlock.map((row) => row.slice().reverse());
    setCurrentBlock(rotatedBlock);
  };

  // 블록 이동
  const moveBlock = (dx, dy) => {
    if (!currentBlock) return;
    const newBlock = currentBlock.map((row, y) => row.map((cell, x) => {
      const newX = x + dx;
      const newY = y + dy;
      if (newX < 0 || newX >= 10 || newY < 0 || newY >= 20) return 0;
      if (grid[newY] && grid[newY][newX] !== null) return 0;
      return cell;
    }));
    setCurrentBlock(newBlock);
  };

  // 충돌 감지
  const checkCollision = () => {
    if (!currentBlock) return;
    for (let y = 0; y < currentBlock.length; y++) {
      for (let x = 0; x < currentBlock[y].length; x++) {
        if (currentBlock[y][x] === 1) {
          const newX = x;
          const newY = y + 1;
          if (newY >= 20 || (grid[newY] && grid[newY][newX] !== null)) {
            return true;
          }
        }
      }
    }
    return false;
  };

  // 점수 계산
  const calculateScore = () => {
    let score = 0;
    for (let y = 0; y < 20; y++) {
      let rowFull = true;
      for (let x = 0; x < 10; x++) {
        if (grid[y] && grid[y][x] === null) {
          rowFull = false;
          break;
        }
      }
      if (rowFull) {
        score += 100;
        grid.splice(y, 1);
        grid.unshift(Array(10).fill(null));
      }
    }
    setScore(score);
  };

  // 레벨 업
  const levelUp = () => {
    setLevel(level + 1);
  };

  // 게임 로직
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (gameOver) return;
      moveBlock(0, 1);
      if (checkCollision()) {
        const newGrid = grid.slice();
        for (let y = 0; y < currentBlock.length; y++) {
          for (let x = 0; x < currentBlock[y].length; x++) {
            if (currentBlock[y][x] === 1) {
              const newX = x;
              const newY = y;
              if (newY >= 0 && newY < 20 && newX >= 0 && newX < 10) {
                newGrid[newY][newX] = 1;
              }
            }
          }
        }
        setGrid(newGrid);
        calculateScore();
        spawnBlock();
      }
    }, 1000 / level);
    return () => clearInterval(intervalId);
  }, [gameOver, level, currentBlock, grid]);

  // 사용자 입력 처리
  const handleKeyDown = (e) => {
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

  // 렌더링
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <div className="grid grid-rows-20 grid-cols-10 gap-1 w-64 h-64 border border-gray-400">
        {grid.map((row, y) => row.map((cell, x) => (
          <div key={`${y},${x}`} className={`w-6 h-6 ${cell === 1 ? 'bg-blue-500' : 'bg-gray-200'}`} />
        )))}
      </div>
      <div className="ml-4">
        <h1 className="text-2xl font-bold">Tetris</h1>
        <p className="text-xl">Score: {score}</p>
        <p className="text-xl">Level: {level}</p>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={startGame}>Start Game</button>
      </div>
      <div className="absolute top-0 left-0">
        <div className="grid grid-rows-4 grid-cols-4 gap-1 w-16 h-16 border border-gray-400">
          {nextBlock && nextBlock.map((row, y) => row.map((cell, x) => (
            <div key={`${y},${x}`} className={`w-4 h-4 ${cell === 1 ? 'bg-blue-500' : 'bg-gray-200'}`} />
          )))}
        </div>
      </div>
    </div>
  );
};

export default Tetris;