import { useState, useEffect } from 'react';

const App = () => {
  const [grid, setGrid] = useState<Array<Array<string | null>>>(Array(20).fill(null).map(() => Array(10).fill(null)));
  const [current, setCurrent] = useState<{ shape: number[][], color: string, x: number, y: number }>({
    shape: [[1, 1, 1, 1]], 
    color: '#FFD700', 
    x: 3, 
    y: 0
  });
  const [nextPiece, setNextPiece] = useState<{ shape: number[][], color: string }>({
    shape: [[1, 1], [1, 1]], 
    color: '#00FF00'
  });
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lines, setLines] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [paused, setPaused] = useState(false);

  const shapes = [
    { shape: [[1, 1, 1, 1]], color: '#FFD700' },
    { shape: [[1, 1], [1, 1]], color: '#00FF00' },
    { shape: [[1, 1, 0], [0, 1, 1]], color: '#FF00FF' },
    { shape: [[0, 1, 1], [1, 1, 0]], color: '#00FFFF' },
    { shape: [[1, 1, 1], [0, 1, 0]], color: '#FF0000' },
    { shape: [[1, 1, 1], [1, 0, 0]], color: '#0000FF' },
    { shape: [[1, 1, 1], [0, 0, 1]], color: '#FFFF00' }
  ];

  const createNewPiece = () => {
    const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
    setNextPiece(randomShape);
    return {
      shape: randomShape.shape,
      color: randomShape.color,
      x: 3,
      y: 0
    };
  };

  const rotate = (matrix: number[][]) => {
    return matrix[0].map((_, i) => matrix.map(row => row[i]).reverse());
  };

  const isValidMove = (piece: { shape: number[][], x: number, y: number }) => {
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x] && 
            (piece.x + x < 0 || 
             piece.x + x >= 10 || 
             piece.y + y >= 20 || 
             grid[piece.y + y]?.[piece.x + x])) {
          return false;
        }
      }
    }
    return true;
  };

  const mergeGrid = (piece: { shape: number[][], color: string, x: number, y: number }) => {
    const newGrid = grid.map(row => [...row]);
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          newGrid[piece.y + y][piece.x + x] = piece.color;
        }
      }
    }
    setGrid(newGrid);
  };

  const clearLines = () => {
    let newGrid = [...grid];
    let linesCleared = 0;
    
    for (let y = newGrid.length - 1; y >= 0; y--) {
      if (newGrid[y].every(cell => cell !== null)) {
        newGrid.splice(y, 1);
        newGrid.unshift(Array(10).fill(null));
        linesCleared++;
        y++;
      }
    }
    
    setGrid(newGrid);
    setLines(prev => prev + linesCleared);
    setScore(prev => prev + linesCleared * 100 * level);
    setLevel(Math.floor((lines + linesCleared) / 10) + 1);
  };

  const moveDown = () => {
    const newCurrent = { ...current };
    newCurrent.y += 1;
    
    if (!isValidMove(newCurrent)) {
      newCurrent.y -= 1;
      mergeGrid(newCurrent);
      clearLines();
      if (current.y === 0) {
        setGameOver(true);
        return;
      }
      setCurrent(createNewPiece());
    } else {
      setCurrent(newCurrent);
    }
  };

  const move = (dx: number) => {
    const newCurrent = { ...current };
    newCurrent.x += dx;
    
    if (isValidMove(newCurrent)) {
      setCurrent(newCurrent);
    }
  };

  const rotatePiece = () => {
    const newCurrent = { ...current };
    newCurrent.shape = rotate(current.shape);
    
    if (isValidMove(newCurrent)) {
      setCurrent(newCurrent);
    }
  };

  const startGame = () => {
    setGrid(Array(20).fill(null).map(() => Array(10).fill(null)));
    setCurrent(createNewPiece());
    setNextPiece(shapes[Math.floor(Math.random() * shapes.length)]);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      moveDown();
    }, 1000);
    return () => clearInterval(interval);
  }, [current]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="grid grid-cols-10 gap-1 w-40 h-40">
        {grid.map((row, y) => (
          <div key={y} className="flex flex-row gap-1">
            {row.map((cell, x) => (
              <div key={x} className={`w-6 h-6 ${cell ? 'bg-blue-500' : 'bg-gray-500'}`}></div>
            ))}
          </div>
        ))}
      </div>
      <div className="flex flex-row gap-2 mt-4">
        <div className="bg-red-500 w-6 h-6"></div>
        <div className="bg-green-500 w-6 h-6"></div>
        <div className="bg-blue-500 w-6 h-6"></div>
        <div className="bg-yellow-500 w-6 h-6"></div>
      </div>
      <div className="flex flex-row gap-2 mt-4">
        <button className="bg-gray-500 p-2 rounded" onClick={startGame}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        <button className="bg-gray-500 p-2 rounded" onClick={moveDown}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
      </div>
      <div className="mt-4">
        <p className="text-lg font-bold">Score: {score}</p>
        <p className="text-lg font-bold">Level: {level}</p>
        <p className="text-lg font-bold">Lines: {lines}</p>
      </div>
    </div>
  );
};

export default App;