import React, { useState, useEffect } from 'react';

const Tetris = () => {
  // 게임 보드 크기
  const boardWidth = 10;
  const boardHeight = 20;

  // 블록 타입
  const blockTypes = [
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

  // 게임 상태
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [board, setBoard] = useState(Array(boardHeight).fill(0).map(() => Array(boardWidth).fill(0)));
  const [currentBlock, setCurrentBlock] = useState(null);
  const [currentBlockX, setCurrentBlockX] = useState(0);
  const [currentBlockY, setCurrentBlockY] = useState(0);

  // 블록 생성
  const createBlock = () => {
    const blockType = blockTypes[Math.floor(Math.random() * blockTypes.length)];
    setCurrentBlock(blockType);
    setCurrentBlockX(boardWidth / 2 - blockType[0].length / 2);
    setCurrentBlockY(0);
  };

  // 블록 회전
  const rotateBlock = () => {
    if (!currentBlock) return;
    const rotatedBlock = currentBlock.map(row => row.slice().reverse());
    setCurrentBlock(rotatedBlock);
  };

  // 블록 이동
  const moveBlock = (dx, dy) => {
    if (!currentBlock) return;
    const newX = currentBlockX + dx;
    const newY = currentBlockY + dy;
    if (newX < 0 || newX + currentBlock[0].length > boardWidth || newY < 0 || newY + currentBlock.length > boardHeight) return;
    if (checkCollision(newX, newY)) return;
    setCurrentBlockX(newX);
    setCurrentBlockY(newY);
  };

  // 충돌 감지
  const checkCollision = (x, y) => {
    if (!currentBlock) return false;
    for (let i = 0; i < currentBlock.length; i++) {
      for (let j = 0; j < currentBlock[i].length; j++) {
        if (currentBlock[i][j] === 1 && (board[y + i] && board[y + i][x + j] === 1)) return true;
      }
    }
    return false;
  };

  // 블록 고정
  const fixBlock = () => {
    if (!currentBlock) return;
    for (let i = 0; i < currentBlock.length; i++) {
      for (let j = 0; j < currentBlock[i].length; j++) {
        if (currentBlock[i][j] === 1) {
          if (board[currentBlockY + i] && board[currentBlockY + i][currentBlockX + j] !== undefined) {
            board[currentBlockY + i][currentBlockX + j] = 1;
          }
        }
      }
    }
    setBoard([...board]);
    createBlock();
  };

  // 게임 오버 조건
  const checkGameOver = () => {
    if (!currentBlock) return false;
    for (let i = 0; i < currentBlock[0].length; i++) {
      if (board[currentBlockY][currentBlockX + i] === 1) return true;
    }
    return false;
  };

  // 점수 계산
  const calculateScore = () => {
    let score = 0;
    for (let i = 0; i < boardHeight; i++) {
      let isFullRow = true;
      for (let j = 0; j < boardWidth; j++) {
        if (board[i][j] === 0) {
          isFullRow = false;
          break;
        }
      }
      if (isFullRow) {
        score += 100;
        board.splice(i, 1);
        board.unshift(Array(boardWidth).fill(0));
        i--;
      }
    }
    setScore(score);
  };

  // 게임 시작
  const startGame = () => {
    setGameOver(false);
    setScore(0);
    setBoard(Array(boardHeight).fill(0).map(() => Array(boardWidth).fill(0)));
    createBlock();
  };

  // 게임 종료
  const endGame = () => {
    setGameOver(true);
  };

  // 키보드 이벤트 처리
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

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (checkGameOver()) {
      endGame();
    }
  }, [currentBlock, currentBlockX, currentBlockY]);

  useEffect(() => {
    if (currentBlock) {
      const intervalId = setInterval(() => {
        moveBlock(0, 1);
      }, 1000);
      return () => {
        clearInterval(intervalId);
      };
    }
  }, [currentBlock, currentBlockX, currentBlockY]);

  return (
    <div className="h-screen w-screen flex justify-center items-center">
      {gameOver ? (
        <div className="text-3xl font-bold">Game Over!</div>
      ) : (
        <div className="grid grid-rows-20 grid-cols-10 gap-1 w-64 h-64 border border-gray-400">
          {board.map((row, y) => row.map((cell, x) => (
            <div key={`${y},${x}`} className={`w-6 h-6 ${cell === 1 ? 'bg-blue-500' : 'bg-gray-200'}`} />
          )))}
          {currentBlock && currentBlock.map((row, y) => row.map((cell, x) => (
            <div key={`${y},${x}`} className={`w-6 h-6 absolute top-${(currentBlockY + y) * 8} left-${(currentBlockX + x) * 8} ${cell === 1 ? 'bg-red-500' : 'bg-gray-200'}`} />
          )))}
        </div>
      )}
      <div className="text-2xl font-bold mt-4">Score: {score}</div>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4" onClick={startGame}>Start Game</button>
    </div>
  );
};

export default Tetris;