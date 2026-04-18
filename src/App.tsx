import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';

const App = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [blocks, setBlocks] = useState([]);
  const [defenses, setDefenses] = useState(null);

  useEffect(() => {
    if (gameStarted) {
      generateBlocks();
      generateDefenses();
    }
  }, [gameStarted]);

  const generateBlocks = () => {
    const newBlocks = [];
    for (let i = 0; i < 10; i++) {
      newBlocks.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
      });
    }
    setBlocks(newBlocks);
  };

  const generateDefenses = () => {
    if (defenses === null) {
      setDefenses([
        { id: 1, type: 'wall' },
        { id: 2, type: 'shield' },
      ]);
    }
  };

  const startGame = () => {
    setGameStarted(true);
  };

  const renderBlocks = () => {
    if (blocks.length > 0) {
      return blocks.map((block) => (
        <div
          key={block.id}
          style={{
            position: 'absolute',
            left: `${block.x}%`,
            top: `${block.y}%`,
            width: '50px',
            height: '50px',
            backgroundColor: 'blue',
          }}
        />
      ));
    } else {
      return <div className="text-center text-3xl">No blocks</div>;
    }
  };

  const renderDefenses = () => {
    if (defenses !== null && defenses.length > 0) {
      return defenses.map((defense) => (
        <div key={defense.id}>
          {defense.type}
        </div>
      ));
    } else {
      return <div className="text-center text-3xl">No defenses</div>;
    }
  };

  return (
    <div className="h-screen w-screen bg-gray-100 flex flex-col items-center justify-center">
      {gameStarted ? (
        <div className="relative w-full h-full">
          {renderBlocks()}
          {renderDefenses()}
        </div>
      ) : (
        <div className="text-center">
          <button
            onClick={startGame}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Start Game
          </button>
        </div>
      )}
    </div>
  );
};

export default App;