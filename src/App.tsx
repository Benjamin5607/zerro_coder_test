import React, { useState, useEffect } from 'react';
import './Tetris.css';

const Tetris = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [block, setBlock] = useState(null);
  const [board, setBoard] = useState(Array(20).fill(null).map(() => Array(10).fill(null)));

  useEffect(() => {
    if (gameStarted) {
      const intervalId = setInterval(() => {
        moveBlockDown();
      }, 1000);
      return () => clearInterval(intervalId);
    }
  }, [gameStarted]);

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setLevel(1);
    setBlock(createNewBlock());
    setBoard(Array(20).fill(null).map(() => Array(10).fill(null)));
  };

  const endGame = () => {
    setGameStarted(false);
    setGameOver(true);
  };

  const createNewBlock = () => {
    const types = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
    const type = types[Math.floor(Math.random() * types.length)];
    const x = 5;
    const y = 0;
    return { type, x, y };
  };

  const moveBlockDown = () => {
    if (block) {
      const newY = block.y + 1;
      if (newY < 20 && !isCollision(block.x, newY)) {
        setBlock({ ...block, y: newY });
      } else {
        fixBlock();
        setBlock(createNewBlock());
      }
    }
  };

  const moveBlockLeft = () => {
    if (block) {
      const newX = block.x - 1;
      if (newX >= 0 && !isCollision(newX, block.y)) {
        setBlock({ ...block, x: newX });
      }
    }
  };

  const moveBlockRight = () => {
    if (block) {
      const newX = block.x + 1;
      if (newX < 10 && !isCollision(newX, block.y)) {
        setBlock({ ...block, x: newX });
      }
    }
  };

  const rotateBlock = () => {
    if (block) {
      const newType = rotateType(block.type);
      setBlock({ ...block, type: newType });
    }
  };

  const isCollision = (x, y) => {
    if (y >= 20) return true;
    if (x < 0 || x >= 10) return true;
    if (board[y][x] !== null) return true;
    return false;
  };

  const fixBlock = () => {
    if (block) {
      const { x, y, type } = block;
      const shape = getShape(type);
      for (let i = 0; i < shape.length; i++) {
        for (let j = 0; j < shape[i].length; j++) {
          if (shape[i][j] === 1) {
            board[y + i][x + j] = type;
          }
        }
      }
      setBoard(board);
      checkLineClear();
    }
  };

  const checkLineClear = () => {
    let linesCleared = 0;
    for (let i = 0; i < 20; i++) {
      let isFull = true;
      for (let j = 0; j < 10; j++) {
        if (board[i][j] === null) {
          isFull = false;
          break;
        }
      }
      if (isFull) {
        linesCleared++;
        board.splice(i, 1);
        board.unshift(Array(10).fill(null));
      }
    }
    if (linesCleared > 0) {
      setScore(score + linesCleared * level);
      if (linesCleared >= 10) {
        setLevel(level + 1);
      }
    }
  };

  const getShape = (type) => {
    switch (type) {
      case 'I':
        return [
          [1, 1, 1, 1]
        ];
      case 'J':
        return [
          [1, 0, 0],
          [1, 1, 1]
        ];
      case 'L':
        return [
          [0, 0, 1],
          [1, 1, 1]
        ];
      case 'O':
        return [
          [1, 1],
          [1, 1]
        ];
      case 'S':
        return [
          [0, 1, 1],
          [1, 1, 0]
        ];
      case 'T':
        return [
          [0, 1, 0],
          [1, 1, 1]
        ];
      case 'Z':
        return [
          [1, 1, 0],
          [0, 1, 1]
        ];
      default:
        return [];
    }
  };

  const rotateType = (type) => {
    switch (type) {
      case 'I':
        return 'I';
      case 'J':
        return 'L';
      case 'L':
        return 'J';
      case 'O':
        return 'O';
      case 'S':
        return 'Z';
      case 'T':
        return 'T';
      case 'Z':
        return 'S';
      default:
        return type;
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'ArrowLeft') {
      moveBlockLeft();
    } else if (e.key === 'ArrowRight') {
      moveBlockRight();
    } else if (e.key === 'ArrowDown') {
      moveBlockDown();
    } else if (e.key === 'ArrowUp') {
      rotateBlock();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <div className="tetris-game">
      {gameOver ? (
        <div className="game-over">Game Over!</div>
      ) : (
        <div>
          <div className="score">Score: {score}</div>
          <div className="level">Level: {level}</div>
          <div className="board">
            {board.map((row, y) => (
              <div key={y} className="row">
                {row.map((cell, x) => (
                  <div key={x} className={`cell ${cell !== null ? 'filled' : ''}`}></div>
                ))}
              </div>
            ))}
          </div>
          {block && (
            <div className="block">
              {getShape(block.type).map((row, y) => (
                <div key={y} className="row">
                  {row.map((cell, x) => (
                    <div key={x} className={`cell ${cell === 1 ? 'filled' : ''}`}></div>
                  ))}
                </div>
              ))}
            </div>
          )}
          <button className="start-button" onClick={startGame}>
            Start Game
          </button>
          <button className="end-button" onClick={endGame}>
            End Game
          </button>
        </div>
      )}
    </div>
  );
};

export default Tetris;