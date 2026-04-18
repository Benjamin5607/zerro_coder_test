import React, { useState, useEffect } from 'react';

function App() {
  // 사용자 인증 및 프로필 관리
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // 팀 및 선수 생성 및 관리
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);

  // 경기 일정 및 결과 관리
  const [schedules, setSchedules] = useState([]);
  const [results, setResults] = useState([]);

  // 실시간 경기 시뮬레이션
  const [simulation, setSimulation] = useState(false);

  // 사용자 인터페이스 및 그래픽 구현
  const [score, setScore] = useState({ home: 0, away: 0 });

  // 사용자 인증
  const handleLogin = () => {
    if (username && password) {
      // 사용자 인증 로직
      const authenticatedUser = { username, password };
      setUser(authenticatedUser);
    }
  };

  // 팀 생성
  const handleCreateTeam = () => {
    if (user) {
      const newTeam = { name: `Team ${teams.length + 1}`, players: [] };
      setTeams([...teams, newTeam]);
    }
  };

  // 선수 생성
  const handleCreatePlayer = (teamIndex) => {
    if (user && teams[teamIndex]) {
      const newPlayer = { name: `Player ${players.length + 1}` };
      setPlayers([...players, newPlayer]);
      const updatedTeams = [...teams];
      updatedTeams[teamIndex].players.push(newPlayer);
      setTeams(updatedTeams);
    }
  };

  // 경기 일정 생성
  const handleCreateSchedule = () => {
    if (user && teams.length >= 2) {
      const newSchedule = { home: teams[0], away: teams[1], date: new Date() };
      setSchedules([...schedules, newSchedule]);
    }
  };

  // 실시간 경기 시뮬레이션
  const handleSimulation = () => {
    if (user && schedules.length > 0) {
      setSimulation(true);
      const intervalId = setInterval(() => {
        // 경기 시뮬레이션 로직
        const updatedScore = { ...score };
        updatedScore.home = Math.floor(Math.random() * 10);
        updatedScore.away = Math.floor(Math.random() * 10);
        setScore(updatedScore);
      }, 1000);
      return () => clearInterval(intervalId);
    }
  };

  // 배열 인덱스 초과 에러 방지
  const getTeam = (index) => {
    if (teams && teams[index] !== undefined) {
      return teams[index];
    }
    return null;
  };

  const getPlayer = (teamIndex, playerIndex) => {
    if (teams && teams[teamIndex] && teams[teamIndex].players[playerIndex] !== undefined) {
      return teams[teamIndex].players[playerIndex];
    }
    return null;
  };

  return (
    <div className="max-w-md mx-auto p-4 mt-12 bg-white rounded-lg shadow-md">
      {user ? (
        <div>
          <h1 className="text-3xl font-bold mb-4">Welcome, {user.username}!</h1>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleCreateTeam}
          >
            Create Team
          </button>
          <ul>
            {teams.map((team, index) => (
              <li key={index} className="py-2">
                {team.name}
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4"
                  onClick={() => handleCreatePlayer(index)}
                >
                  Create Player
                </button>
              </li>
            ))}
          </ul>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleCreateSchedule}
          >
            Create Schedule
          </button>
          <ul>
            {schedules.map((schedule, index) => (
              <li key={index} className="py-2">
                {schedule.home.name} vs {schedule.away.name}
              </li>
            ))}
          </ul>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleSimulation}
          >
            Start Simulation
          </button>
          {simulation && (
            <div>
              <h2 className="text-2xl font-bold mb-2">Score</h2>
              <p>
                {score.home} - {score.away}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div>
          <h1 className="text-3xl font-bold mb-4">Login</h1>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="block w-full p-2 mb-4 border border-gray-400 rounded"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="block w-full p-2 mb-4 border border-gray-400 rounded"
          />
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleLogin}
          >
            Login
          </button>
        </div>
      )}
    </div>
  );
}

export default App;