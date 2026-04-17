import React, { useState, useEffect } from 'react';

function App() {
  const [board, setBoard] = useState(new Array(20).fill(0).map(() => new Array(10).fill(0)));
  const [currentTetrimino, setCurrentTetrimino] = useState({
    shape: [
      [1, 1],
      [1, 1]
    ],
    x: 5,
    y: 0,
    color: 'bg-red-500'
  });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [currentTetriminoSize, setCurrentTetriminoSize] = useState(currentTetrimino.shape.length);

  useEffect(() => {
    const intervalId = setInterval(() => {
      moveCurrentTetrimino(0, 1);
      if (checkCollision()) {
        setGameOver(true);
        clearInterval(intervalId);
      } else {
        setCurrentTetriminoSize(currentTetrimino.shape.length);
      }
    }, 1000);
    return () => clearInterval(intervalId);
  }, [currentTetrimino]);

  const moveCurrentTetrimino = (dx, dy) => {
    setCurrentTetrimino((prevTetrimino) => ({
      ...prevTetrimino,
      x: prevTetrimino.x + dx,
      y: prevTetrimino.y + dy
    }));
  };

  const checkCollision = () => {
    const newBoard = [...board];
    for (let i = 0; i < currentTetrimino.shape.length; i++) {
      for (let j = 0; j < currentTetrimino.shape[i].length; j++) {
        if (currentTetrimino.shape[i][j] === 1) {
          if (newBoard[currentTetrimino.y + i][currentTetrimino.x + j] !== 0) {
            return true;
          }
        }
      }
    }
    return false;
  };

  const renderBoard = () => {
    return board.map((row, y) => (
      <div key={y} className="flex justify-center items-center h-12">
        {row.map((cell, x) => (
          <div
            key={x}
            className={`w-6 h-6 border border-gray-700 ${cell === 0 ? 'bg-black' : cell === 1 ? currentTetrimino.color : ''}`}
          />
        ))}
      </div>
    ));
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-120 h-240 border border-gray-700">
        {renderBoard()}
      </div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 text-2xl font-bold">
        점수: {score}
      </div>
      <div className="absolute top-0 right-1/2 -translate-x-1/2 text-2xl font-bold">
        {gameOver ? '게임 오버!' : `현재 테트리미노 크기: ${currentTetriminoSize}`}
      </div>
    </div>
  );
}

export default App;