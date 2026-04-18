import React, { useState, useEffect } from 'react';

const App = () => {
  const [blocks, setBlocks] = useState<Array<{ id: number; color: string } | null>>([]);
  const [isMoving, setIsMoving] = useState(false);
  const [matchesGoal, setMatchesGoal] = useState(false);
  const [hasNullDefenses, setHasNullDefenses] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!isMoving) {
        setIsMoving(true);
        const newBlocks: Array<{ id: number; color: string } | null> = [];
        for (let i = 0; i < 10; i++) {
          if (Math.random() < 0.5) {
            newBlocks.push({ id: i, color: 'blue' });
          } else {
            newBlocks.push(null);
          }
        }
        setBlocks(newBlocks);
      }
    }, 1000);
    return () => clearInterval(intervalId);
  }, [isMoving]);

  useEffect(() => {
    if (blocks.length > 0) {
      const hasNull = blocks.some((block) => block === null);
      setHasNullDefenses(hasNull);
    }
  }, [blocks]);

  const handleMove = () => {
    if (!isMoving && blocks.length > 0) {
      setIsMoving(true);
      const newBlocks = blocks.map((block, index) => {
        if (block !== null && index < blocks.length - 1) {
          return { ...block, id: block.id + 1 };
        }
        return block;
      });
      setBlocks(newBlocks);
    }
  };

  const handleCheckGoal = () => {
    if (blocks.length > 0) {
      const goalBlock = blocks.find((block) => block !== null && block.id >= 9);
      if (goalBlock) {
        setMatchesGoal(true);
      }
    }
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="w-80 h-80 flex flex-col items-center justify-center space-y-2">
        {blocks.map((block, index) => (
          <div key={index} className="w-10 h-10">
            {block !== null && (
              <div className="w-full h-full bg-blue-500 flex items-center justify-center">
                <div className="text-white" style={{ fontSize: 20 }}>&#8592;</div>
              </div>
            )}
            {block === null && (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <div className="text-gray-500" style={{ fontSize: 20 }}>&#9658;</div>
              </div>
            )}
          </div>
        ))}
      </div>
      <button
        className="w-20 h-10 bg-blue-500 text-white rounded-lg"
        onClick={handleMove}
      >
        Move
      </button>
      <button
        className="w-20 h-10 bg-green-500 text-white rounded-lg"
        onClick={handleCheckGoal}
      >
        Check Goal
      </button>
      {matchesGoal && (
        <div className="w-full h-10 bg-green-500 text-white flex items-center justify-center">
          Goal Reached!
        </div>
      )}
      {hasNullDefenses && (
        <div className="w-full h-10 bg-red-500 text-white flex items-center justify-center">
          Null Defenses Detected!
        </div>
      )}
    </div>
  );
};

export default App;