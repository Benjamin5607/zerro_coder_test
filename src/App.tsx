import React, { useState, useEffect } from 'react';
import './App.css';

interface Block {
  x: number;
  y: number;
  color: string;
}

interface TetrisGame {
  grid: Block[][];
  score: number;
  level: number;
  nextBlock: Block;
}

const App = () => {
  const [gameState, setGameState] = useState<TetrisGame>({
    grid: Array(20).fill(null).map(() => Array(10).fill(null)),
    score: 0,
    level: 1,
    nextBlock: {
      x: 5,
      y: 0,
      color: 'red',
    },
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      const newGameState = { ...gameState };
      newGameState.grid = moveBlock(newGameState.grid, newGameState.nextBlock);
      newGameState.score = calculateScore(newGameState.grid);
      newGameState.level = calculateLevel(newGameState.score);
      newGameState.nextBlock = generateNextBlock();
      setGameState(newGameState);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [gameState]);

  const moveBlock = (grid: Block[][], block: Block): Block[][] => {
    const newGrid = grid.map((row) => [...row]);
    newGrid[block.y][block.x] = block;
    return newGrid;
  };

  const calculateScore = (grid: Block[][]): number => {
    let score = 0;
    for (let y = 0; y < grid.length; y++) {
      for (let x = 0; x < grid[y].length; x++) {
        if (grid[y][x] && grid[y][x].color === 'red') {
          score++;
        }
      }
    }
    return score;
  };

  const calculateLevel = (score: number): number => {
    return Math.floor(score / 10);
  };

  const generateNextBlock = (): Block => {
    return {
      x: Math.floor(Math.random() * 10),
      y: 0,
      color: 'red',
    };
  };

  return (
    <div className="App">
      <div className="grid">
        {gameState.grid.map((row, y) => (
          <div key={y} className="row">
            {row.map((block, x) => (
              <div
                key={x}
                className={`block ${block ? 'filled' : ''} ${block?.color}`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="score">Score: {gameState.score}</div>
      <div className="level">Level: {gameState.level}</div>
    </div>
  );
};

export default App;