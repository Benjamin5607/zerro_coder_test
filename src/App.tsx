import React, { useState, useEffect } from 'react';

const App = () => {
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [record, setRecord] = useState([]);
  const [currentBlock, setCurrentBlock] = useState({
    shape: '',
    x: 5,
    y: 0,
    rotation: 0,
  });
  const [grid, setGrid] = useState(Array(20).fill(0).map(() => Array(10).fill(0)));

  const createBlock = () => {
    const shapes = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    const x = 5;
    const y = 0;
    const rotation = 0;
    return { shape, x, y, rotation };
  };

  const moveBlock = (direction) => {
    switch (direction) {
      case 'left':
        if (currentBlock.x > 0) {
          setCurrentBlock((prevBlock) => ({ ...prevBlock, x: prevBlock.x - 1 }));
        }
        break;
      case 'right':
        if (currentBlock.x < 9) {
          setCurrentBlock((prevBlock) => ({ ...prevBlock, x: prevBlock.x + 1 }));
        }
        break;
      case 'down':
        if (currentBlock.y < 19) {
          setCurrentBlock((prevBlock) => ({ ...prevBlock, y: prevBlock.y + 1 }));
        }
        break;
      case 'rotate':
        setCurrentBlock((prevBlock) => ({ ...prevBlock, rotation: (prevBlock.rotation + 1) % 4 }));
        break;
      default:
        break;
    }
  };

  const increaseScore = () => {
    setScore((prevScore) => prevScore + 1);
  };

  const saveRecord = () => {
    const newRecord = [...record, score];
    setRecord(newRecord);
  };

  const gameOverHandler = () => {
    setGameOver(true);
    saveRecord();
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentBlock(createBlock());
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      moveBlock('down');
    }, 1000);
    return () => clearInterval(intervalId);
  }, [currentBlock]);

  useEffect(() => {
    const gridCopy = [...grid];
    const blockShape = getBlockShape(currentBlock.shape, currentBlock.rotation);
    for (let i = 0; i < blockShape.length; i++) {
      for (let j = 0; j < blockShape[i].length; j++) {
        if (blockShape[i][j] === 1) {
          gridCopy[currentBlock.y + i][currentBlock.x + j] = 1;
        }
      }
    }
    setGrid(gridCopy);
  }, [currentBlock]);

  useEffect(() => {
    const gridCopy = [...grid];
    const blockShape = getBlockShape(currentBlock.shape, currentBlock.rotation);
    for (let i = 0; i < blockShape.length; i++) {
      for (let j = 0; j < blockShape[i].length; j++) {
        if (blockShape[i][j] === 1) {
          if (currentBlock.y + i >= 20 || gridCopy[currentBlock.y + i + 1][currentBlock.x + j] === 1) {
            gameOverHandler();
          } else {
            gridCopy[currentBlock.y + i][currentBlock.x + j] = 1;
          }
        }
      }
    }
    setGrid(gridCopy);
  }, [currentBlock]);

  useEffect(() => {
    const blockShape = getBlockShape(currentBlock.shape, currentBlock.rotation);
    const gridCopy = [...grid];
    for (let i = 0; i < blockShape.length; i++) {
      for (let j = 0; j < blockShape[i].length; j++) {
        if (blockShape[i][j] === 1) {
          gridCopy[currentBlock.y + i][currentBlock.x + j] = 0;
        }
      }
    }
    setCurrentBlock((prevBlock) => ({ ...prevBlock, rotation: (prevBlock.rotation + 1) % 4 }));
    const newBlockShape = getBlockShape(currentBlock.shape, currentBlock.rotation);
    for (let i = 0; i < newBlockShape.length; i++) {
      for (let j = 0; j < newBlockShape[i].length; j++) {
        if (newBlockShape[i][j] === 1) {
          gridCopy[currentBlock.y + i][currentBlock.x + j] = 1;
        }
      }
    }
    setGrid(gridCopy);
  }, [currentBlock]);

  useEffect(() => {
    const gridCopy = [...grid];
    for (let i = 0; i < 20; i++) {
      for (let j = 0; j < 10; j++) {
        if (gridCopy[i][j] === 1) {
          gridCopy[i][j] = 0;
        }
      }
    }
    setGrid(gridCopy);
  }, []);

  const getBlockShape = (shape, rotation) => {
    switch (shape) {
      case 'I':
        return [
          [1, 1, 1, 1],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ];
      case 'J':
        return [
          [1, 0, 0],
          [1, 1, 1],
          [0, 0, 0],
          [0, 0, 0],
        ];
      case 'L':
        return [
          [0, 0, 1],
          [1, 1, 1],
          [0, 0, 0],
          [0, 0, 0],
        ];
      case 'O':
        return [
          [1, 1],
          [1, 1],
          [0, 0],
          [0, 0],
        ];
      case 'S':
        return [
          [0, 1, 1],
          [1, 1, 0],
          [0, 0, 0],
          [0, 0, 0],
        ];
      case 'T':
        return [
          [0, 1, 0],
          [1, 1, 1],
          [0, 0, 0],
          [0, 0, 0],
        ];
      case 'Z':
        return [
          [1, 1, 0],
          [0, 1, 1],
          [0, 0, 0],
          [0, 0, 0],
        ];
      default:
        return [
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ];
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="grid grid-cols-10 gap-1">
        {grid.map((row, i) => (
          <div key={i} className="flex justify-center items-center">
            {row.map((cell, j) => (
              <div
                key={j}
                className={`w-4 h-4 bg-gray-400 rounded-lg ${cell === 1 ? 'bg-red-500' : ''}`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gray-200">
        <p className="text-lg font-bold">Score: {score}</p>
        <p className="text-lg font-bold">Record: {record.join(', ')}</p>
      </div>
    </div>
  );
};

export default App;