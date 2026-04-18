import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ArrowLeft } from 'lucide-react';

// GameBoard 컴포넌트
const GameBoard = ({ width, height, grid }) => {
  return (
    <div
      className="bg-gray-200 p-4 rounded-lg shadow-md"
      style={{ width: width, height: height }}
    >
      {grid.map((row, y) => (
        <div key={y} className="flex">
          {row.map((cell, x) => (
            <div
              key={x}
              className={`w-4 h-4 border border-gray-400 ${
                cell ? 'bg-blue-500' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

// Tetromino 컴포넌트
const Tetromino = ({ type, x, y, rotation }) => {
  const tetrominoTypes = useMemo(() => {
    return {
      I: [
        [1, 1, 1, 1],
      ],
      J: [
        [1, 0, 0],
        [1, 1, 1],
      ],
      L: [
        [0, 0, 1],
        [1, 1, 1],
      ],
      O: [
        [1, 1],
        [1, 1],
      ],
      S: [
        [0, 1, 1],
        [1, 1, 0],
      ],
      T: [
        [0, 1, 0],
        [1, 1, 1],
      ],
      Z: [
        [1, 1, 0],
        [0, 1, 1],
      ],
    };
  }, []);

  const tetromino = tetrominoTypes[type];

  if (!tetromino) return null;

  return (
    <div
      className="absolute"
      style={{ left: x * 20, top: y * 20 }}
    >
      {tetromino.map((row, y) => (
        <div key={y} className="flex">
          {row.map((cell, x) => (
            <div
              key={x}
              className={`w-4 h-4 border border-gray-400 ${
                cell ? 'bg-blue-500' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

// ScoreManager 컴포넌트
const ScoreManager = ({ score, level }) => {
  return (
    <div className="text-lg font-medium mb-4">
      <p>Score: {score}</p>
      <p>Level: {level}</p>
    </div>
  );
};

// InputHandler 컴포넌트
const InputHandler = ({ handleMoveLeft, handleMoveRight, handleRotate }) => {
  const handleKeyDown = useCallback((e) => {
    switch (e.key) {
      case 'ArrowLeft':
        handleMoveLeft();
        break;
      case 'ArrowRight':
        handleMoveRight();
        break;
      case 'ArrowUp':
        handleRotate();
        break;
      default:
        break;
    }
  }, [handleMoveLeft, handleMoveRight, handleRotate]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return null;
};

// GameController 컴포넌트
const GameController = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [tetromino, setTetromino] = useState({
    type: 'I',
    x: 5,
    y: 0,
    rotation: 0,
  });
  const [grid, setGrid] = useState(
    Array(20)
      .fill(null)
      .map(() => Array(10).fill(0))
  );

  const handleMoveLeft = useCallback(() => {
    if (tetromino.x > 0) {
      setTetromino((prevTetromino) => ({ ...prevTetromino, x: prevTetromino.x - 1 }));
    }
  }, [tetromino.x]);

  const handleMoveRight = useCallback(() => {
    if (tetromino.x < 9) {
      setTetromino((prevTetromino) => ({ ...prevTetromino, x: prevTetromino.x + 1 }));
    }
  }, [tetromino.x]);

  const handleRotate = useCallback(() => {
    setTetromino((prevTetromino) => ({ ...prevTetromino, rotation: (prevTetromino.rotation + 1) % 4 }));
  }, [tetromino.rotation]);

  const handleStartGame = useCallback(() => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setLevel(1);
    setTetromino({ type: 'I', x: 5, y: 0, rotation: 0 });
    setGrid(
      Array(20)
        .fill(null)
        .map(() => Array(10).fill(0))
    );
  }, []);

  const handleGameOver = useCallback(() => {
    setGameStarted(false);
    setGameOver(true);
  }, []);

  useEffect(() => {
    if (gameStarted) {
      const intervalId = setInterval(() => {
        if (tetromino.y < 19) {
          setTetromino((prevTetromino) => ({ ...prevTetromino, y: prevTetromino.y + 1 }));
        } else {
          handleGameOver();
        }
      }, 1000);

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [gameStarted, tetromino.y, handleGameOver]);

  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <div className="bg-gray-200 p-4 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">테트리스 게임</h1>
        <GameBoard width={200} height={400} grid={grid} />
        <Tetromino {...tetromino} />
        <ScoreManager score={score} level={level} />
        <InputHandler handleMoveLeft={handleMoveLeft} handleMoveRight={handleMoveRight} handleRotate={handleRotate} />
        {gameStarted ? (
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg"
            onClick={handleGameOver}
          >
            게임 종료
          </button>
        ) : (
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
            onClick={handleStartGame}
          >
            게임 시작
          </button>
        )}
        {gameOver && (
          <p className="text-lg font-medium mb-4">게임 오버!</p>
        )}
      </div>
    </div>
  );
};

const App = () => {
  return <GameController />;
};

export default App;