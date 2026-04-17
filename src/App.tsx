import React, { useState } from 'react';

function App() {
  const [gameBoard, setGameBoard] = useState([]);
  const [tetris, setTetris] = useState({ x: 0, y: 0 });
  const [direction, setDirection] = useState('right');
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lines, setLines] = useState(0);

  const handleGameBoard = () => {
    const newGameBoard = Array(20).fill(0).map(() => Array(10).fill(0));
    setGameBoard(newGameBoard);
  };

  React.useEffect(() => {
    handleGameBoard();
  }, []);

  return (
    <div className="game-board">
      {gameBoard.map((row, y) => (
        <div key={y} className="row">
          {row.map((block, x) => (
            <div
              key={x}
              className={`block ${block === 1 ? 'filled' : ''}`}
              style={{
                backgroundColor: block === 1 ? 'red' : 'bg-slate-800',
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default App;