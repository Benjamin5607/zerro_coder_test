import React, { useState, useEffect } from 'react';
import './Tetris.css';

const Tetris = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [block, setBlock] = useState(null);
  const [board, setBoard] = useState([]);
  const [userInput, setUserInput] = useState(null);

  useEffect(() => {
    if (gameStarted) {
      const intervalId = setInterval(() => {
        moveBlockDown();
      }, 1000 / level);
      return () => clearInterval(intervalId);
    }
  }, [gameStarted, level]);

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setLevel(1);
    setBlock(generateBlock());
    setBoard(generateBoard());
  };

  const endGame = () => {
    setGameStarted(false);
    setGameOver(true);
  };

  const generateBlock = () => {
    const shapes = [
      [[1, 1], [1, 1]],
      [[1, 1, 1], [0, 1, 0]],
      [[1, 1, 1], [1, 0, 0]],
      [[1, 1, 1], [0, 0, 1]],
      [[1, 1, 0], [0, 1, 1]],
      [[0, 1, 1], [1, 1, 0]],
      [[1, 0, 0], [1, 1, 1]],
    ];
    const randomIndex = Math.floor(Math.random() * shapes.length);
    return shapes[randomIndex];
  };

  const generateBoard = () => {
    const board = [];
    for (let i = 0; i < 20; i++) {
      board.push([]);
      for (let j = 0; j < 10; j++) {
        board[i].push(0);
      }
    }
    return board;
  };

  const moveBlockDown = () => {
    if (block === null) return;
    const newBlock = block.map((row, i) => row.slice());
    for (let i = 0; i < newBlock.length; i++) {
      for (let j = 0; j < newBlock[i].length; j++) {
        if (newBlock[i][j] === 1) {
          if (i + 1 >= board.length) {
            mergeBlock();
            setBlock(generateBlock());
            return;
          }
          if (board[i + 1][j] === 1) {
            mergeBlock();
            setBlock(generateBlock());
            return;
          }
        }
      }
    }
    for (let i = 0; i < newBlock.length; i++) {
      for (let j = 0; j < newBlock[i].length; j++) {
        if (newBlock[i][j] === 1) {
          board[i + 1][j] = 1;
          board[i][j] = 0;
        }
      }
    }
    setBoard(board);
  };

  const mergeBlock = () => {
    for (let i = 0; i < block.length; i++) {
      for (let j = 0; j < block[i].length; j++) {
        if (block[i][j] === 1) {
          board[i][j] = 1;
        }
      }
    }
    checkLineClear();
  };

  const checkLineClear = () => {
    let linesCleared = 0;
    for (let i = 0; i < board.length; i++) {
      let isFullLine = true;
      for (let j = 0; j < board[i].length; j++) {
        if (board[i][j] === 0) {
          isFullLine = false;
          break;
        }
      }
      if (isFullLine) {
        linesCleared++;
        board.splice(i, 1);
        board.unshift([]);
        for (let j = 0; j < 10; j++) {
          board[0].push(0);
        }
      }
    }
    setScore(score + linesCleared * level * 100);
    if (linesCleared >= 10) {
      setLevel(level + 1);
    }
  };

  const handleUserInput = (input) => {
    if (input === 'left') {
      moveBlockLeft();
    } else if (input === 'right') {
      moveBlockRight();
    } else if (input === 'down') {
      moveBlockDown();
    } else if (input === 'up') {
      rotateBlock();
    }
  };

  const moveBlockLeft = () => {
    if (block === null) return;
    const newBlock = block.map((row, i) => row.slice());
    for (let i = 0; i < newBlock.length; i++) {
      for (let j = 0; j < newBlock[i].length; j++) {
        if (newBlock[i][j] === 1) {
          if (j - 1 < 0) return;
          if (board[i][j - 1] === 1) return;
        }
      }
    }
    for (let i = 0; i < newBlock.length; i++) {
      for (let j = 0; j < newBlock[i].length; j++) {
        if (newBlock[i][j] === 1) {
          board[i][j - 1] = 1;
          board[i][j] = 0;
        }
      }
    }
    setBoard(board);
  };

  const moveBlockRight = () => {
    if (block === null) return;
    const newBlock = block.map((row, i) => row.slice());
    for (let i = 0; i < newBlock.length; i++) {
      for (let j = 0; j < newBlock[i].length; j++) {
        if (newBlock[i][j] === 1) {
          if (j + 1 >= board[0].length) return;
          if (board[i][j + 1] === 1) return;
        }
      }
    }
    for (let i = 0; i < newBlock.length; i++) {
      for (let j = 0; j < newBlock[i].length; j++) {
        if (newBlock[i][j] === 1) {
          board[i][j + 1] = 1;
          board[i][j] = 0;
        }
      }
    }
    setBoard(board);
  };

  const rotateBlock = () => {
    if (block === null) return;
    const newBlock = block.map((row, i) => row.slice());
    for (let i = 0; i < newBlock.length; i++) {
      for (let j = 0; j < newBlock[i].length; j++) {
        if (newBlock[i][j] === 1) {
          if (i + 1 >= board.length || j + 1 >= board[0].length) return;
          if (board[i + 1][j + 1] === 1) return;
        }
      }
    }
    for (let i = 0; i < newBlock.length; i++) {
      for (let j = 0; j < newBlock[i].length; j++) {
        if (newBlock[i][j] === 1) {
          board[i + 1][j + 1] = 1;
          board[i][j] = 0;
        }
      }
    }
    setBoard(board);
  };

  return (
    <div className="tetris-game">
      {gameOver ? (
        <div className="game-over-screen">
          <h1>Game Over!</h1>
          <p>Score: {score}</p>
          <button onClick={startGame}>Play Again</button>
        </div>
      ) : (
        <div>
          <div className="game-board">
            {board.map((row, i) => (
              <div key={i} className="row">
                {row.map((cell, j) => (
                  <div key={j} className={`cell ${cell === 1 ? 'filled' : ''}`}></div>
                ))}
              </div>
            ))}
          </div>
          <div className="game-info">
            <p>Score: {score}</p>
            <p>Level: {level}</p>
          </div>
          <div className="game-controls">
            <button onClick={() => handleUserInput('left')}>Left</button>
            <button onClick={() => handleUserInput('right')}>Right</button>
            <button onClick={() => handleUserInput('down')}>Down</button>
            <button onClick={() => handleUserInput('up')}>Up</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tetris;