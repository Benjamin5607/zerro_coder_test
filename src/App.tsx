import React, { useState } from 'react';

function App() {
  const [username, setUsername] = useState('');
  const [team, setTeam] = useState('');
  const [gameMode, setGameMode] = useState('');
  const [score, setScore] = useState({ home: 0, away: 0 });
  const [result, setResult] = useState([]);
  const teams = ['Team A', 'Team B', 'Team C'];
  const gameModes = ['Friendly', 'Tournament', 'League'];

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleTeamChange = (e) => {
    setTeam(e.target.value);
  };

  const handleGameModeChange = (e) => {
    setGameMode(e.target.value);
  };

  const handleScoreChange = (team, value) => {
    if (team === 'home') {
      setScore({ ...score, home: score.home + value });
    } else {
      setScore({ ...score, away: score.away + value });
    }
  };

  const handleResultSave = () => {
    if (username && team && gameMode) {
      const newResult = {
        username,
        team,
        gameMode,
        score: { ...score },
      };
      setResult([...result, newResult]);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 mt-12 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-4">Football Game</h1>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
          Username:
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="username"
          type="text"
          value={username}
          onChange={handleUsernameChange}
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="team">
          Team:
        </label>
        <select
          className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          id="team"
          value={team}
          onChange={handleTeamChange}
        >
          <option value="">Select Team</option>
          {teams.map((team, index) => (
            <option key={index} value={team}>
              {team}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="gameMode">
          Game Mode:
        </label>
        <select
          className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
          id="gameMode"
          value={gameMode}
          onChange={handleGameModeChange}
        >
          <option value="">Select Game Mode</option>
          {gameModes.map((mode, index) => (
            <option key={index} value={mode}>
              {mode}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-2">Score:</h2>
        <div className="flex justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => handleScoreChange('home', 1)}
          >
            Home +1
          </button>
          <span className="text-2xl font-bold">{score.home} - {score.away}</span>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => handleScoreChange('away', 1)}
          >
            Away +1
          </button>
        </div>
      </div>
      <button
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        onClick={handleResultSave}
      >
        Save Result
      </button>
      <h2 className="text-2xl font-bold mt-4">Results:</h2>
      <ul>
        {result.map((result, index) => (
          <li key={index} className="py-2">
            <span className="font-bold">{result.username}</span> - {result.team} - {result.gameMode} -{' '}
            {result.score.home} - {result.score.away}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;