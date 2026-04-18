import React, { useState, useEffect } from 'react';

const Tetris = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [speed, setSpeed] = useState(1000);
  const [block, setBlock] = useState(null);
  const [board, setBoard] = useState([
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]);

  const blocks = [
    [
      [1, 1],
      [1, 1],
    ],
    [
      [1, 1, 1],
      [0, 1, 0],
    ],
    [
      [0, 1, 0],
      [1, 1, 1],
    ],
    [
      [1, 1, 0],
      [0, 1, 1],
    ],
    [
      [0, 1, 1],
      [1, 1, 0],
    ],
    [
      [1, 0, 0],
      [1, 1, 1],
    ],
    [
      [0, 0, 1],
      [1, 1, 1],
    ],
  ];

  const handleStartGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setLevel(1);
    setSpeed(1000);
    setBlock(null);
    setBoard([
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ]);
  };

  const handleMoveBlock = (direction) => {
    if (block) {
      const newBlock = { ...block };
      if (direction === 'left') {
        newBlock.x -= 1;
      } else if (direction === 'right') {
        newBlock.x += 1;
      } else if (direction === 'down') {
        newBlock.y += 1;
      }
      setBlock(newBlock);
    }
  };

  const handleRotateBlock = () => {
    if (block) {
      const newBlock = { ...block };
      newBlock.rotation += 1;
      setBlock(newBlock);
    }
  };

  const handleDeleteBlock = () => {
    if (block) {
      const newBoard = [...board];
      for (let i = 0; i < block.shape.length; i++) {
        for (let j = 0; j < block.shape[i].length; j++) {
          if (block.shape[i][j] === 1) {
            newBoard[block.y + i][block.x + j] = 0;
          }
        }
      }
      setBoard(newBoard);
      setBlock(null);
    }
  };

  const handleCheckCollision = () => {
    if (block) {
      const newBoard = [...board];
      for (let i = 0; i < block.shape.length; i++) {
        for (let j = 0; j < block.shape[i].length; j++) {
          if (block.shape[i][j] === 1) {
            if (block.x + j < 0 || block.x + j >= 10 || block.y + i >= 20) {
              return true;
            }
            if (newBoard[block.y + i][block.x + j] === 1) {
              return true;
            }
          }
        }
      }
      return false;
    }
    return false;
  };

  const handleCreateBlock = () => {
    const randomIndex = Math.floor(Math.random() * blocks.length);
    const newBlock = {
      shape: blocks[randomIndex],
      x: 3,
      y: 0,
      rotation: 0,
    };
    setBlock(newBlock);
  };

  const handleUpdateScore = () => {
    const newScore = score + 1;
    setScore(newScore);
  };

  const handleUpdateLevel = () => {
    const newLevel = level + 1;
    setLevel(newLevel);
  };

  const handleUpdateSpeed = () => {
    const newSpeed = speed - 100;
    setSpeed(newSpeed);
  };

  useEffect(() => {
    if (gameStarted) {
      const intervalId = setInterval(() => {
        if (block) {
          handleMoveBlock('down');
          if (handleCheckCollision()) {
            handleDeleteBlock();
            handleCreateBlock();
          }
        } else {
          handleCreateBlock();
        }
      }, speed);
      return () => clearInterval(intervalId);
    }
  }, [gameStarted, block, speed]);

  return (
    <div>
      {gameStarted ? (
        <div>
          <h1>Score: {score}</h1>
          <h1>Level: {level}</h1>
          <div>
            {board.map((row, index) => (
              <div key={index}>
                {row.map((cell, cellIndex) => (
                  <div key={cellIndex} style={{ width: 20, height: 20, backgroundColor: cell === 1 ? 'black' : 'white' }} />
                ))}
              </div>
            ))}
          </div>
          {block ? (
            <div>
              <h1>Block:</h1>
              {block.shape.map((row, index) => (
                <div key={index}>
                  {row.map((cell, cellIndex) => (
                    <div key={cellIndex} style={{ width: 20, height: 20, backgroundColor: cell === 1 ? 'black' : 'white' }} />
                  ))}
                </div>
              ))}
            </div>
          ) : null}
          <button onClick={() => handleMoveBlock('left')}>Left</button>
          <button onClick={() => handleMoveBlock('right')}>Right</button>
          <button onClick={() => handleMoveBlock('down')}>Down</button>
          <button onClick={handleRotateBlock}>Rotate</button>
          <button onClick={handleDeleteBlock}>Delete</button>
        </div>
      ) : (
        <div>
          <h1>Tetris Game</h1>
          <button onClick={handleStartGame}>Start Game</button>
        </div>
      )}
    </div>
  );
};

export default Tetris;