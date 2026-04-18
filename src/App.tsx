import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';

const App = () => {
  const [matchesGoal, setMatchesGoal] = useState(0);
  const [hasNullDefenses, setHasNullDefenses] = useState(false);
  const [hasNoGhostFunctions, setHasNoGhostFunctions] = useState(true);

  const handleMatchesGoal = (value) => {
    if (value !== null && value !== undefined) {
      setMatchesGoal(value);
    }
  };

  const handleHasNullDefenses = (value) => {
    if (value !== null && value !== undefined) {
      setHasNullDefenses(value);
    }
  };

  const handleHasNoGhostFunctions = (value) => {
    if (value !== null && value !== undefined) {
      setHasNoGhostFunctions(value);
    }
  };

  useEffect(() => {
    if (matchesGoal > 0 && !hasNullDefenses && hasNoGhostFunctions) {
      // 게임 로직 구현
    }
  }, [matchesGoal, hasNullDefenses, hasNoGhostFunctions]);

  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <div className="bg-gray-200 p-4 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">피파온라인 같은 게임</h1>
        <div className="flex flex-col mb-4">
          <label className="text-lg font-medium mb-2">matchesGoal:</label>
          <input
            type="number"
            value={matchesGoal}
            onChange={(e) => handleMatchesGoal(parseInt(e.target.value))}
            className="p-2 border border-gray-400 rounded-lg"
          />
        </div>
        <div className="flex flex-col mb-4">
          <label className="text-lg font-medium mb-2">hasNullDefenses:</label>
          <input
            type="checkbox"
            checked={hasNullDefenses}
            onChange={(e) => handleHasNullDefenses(e.target.checked)}
            className="p-2 border border-gray-400 rounded-lg"
          />
        </div>
        <div className="flex flex-col mb-4">
          <label className="text-lg font-medium mb-2">hasNoGhostFunctions:</label>
          <input
            type="checkbox"
            checked={hasNoGhostFunctions}
            onChange={(e) => handleHasNoGhostFunctions(e.target.checked)}
            className="p-2 border border-gray-400 rounded-lg"
          />
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
          onClick={() => {
            if (matchesGoal > 0 && !hasNullDefenses && hasNoGhostFunctions) {
              // 게임 시작 로직 구현
            }
          }}
        >
          게임 시작
        </button>
        <ArrowLeft size={24} className="ml-2" />
      </div>
    </div>
  );
};

export default App;