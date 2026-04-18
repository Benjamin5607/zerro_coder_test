import React, { useState, useEffect } from 'react';

const MarioGame = () => {
  // 게임 상태 초기화
  const [marioX, setMarioX] = useState(100);
  const [marioY, setMarioY] = useState(100);
  const [enemies, setEnemies] = useState([
    { x: 200, y: 200 },
    { x: 300, y: 300 },
  ]);
  const [coins, setCoins] = useState([
    { x: 150, y: 150 },
    { x: 250, y: 250 },
  ]);
  const [powerUps, setPowerUps] = useState([
    { x: 400, y: 400 },
  ]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // 사용자 입력 처리
  const handleKeyPress = (e) => {
    if (e.key === 'ArrowUp') {
      setMarioY(marioY - 10);
    } else if (e.key === 'ArrowDown') {
      setMarioY(marioY + 10);
    } else if (e.key === 'ArrowLeft') {
      setMarioX(marioX - 10);
    } else if (e.key === 'ArrowRight') {
      setMarioX(marioX + 10);
    }
  };

  // 적 캐릭터 자동 이동
  useEffect(() => {
    const intervalId = setInterval(() => {
      setEnemies((prevEnemies) => {
        return prevEnemies.map((enemy) => {
          if (enemy.x < marioX) {
            return { x: enemy.x + 5, y: enemy.y };
          } else if (enemy.x > marioX) {
            return { x: enemy.x - 5, y: enemy.y };
          } else {
            return enemy;
          }
        });
      });
    }, 1000);
    return () => clearInterval(intervalId);
  }, [marioX]);

  // 아이템 수집 및 사용
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCoins((prevCoins) => {
        return prevCoins.filter((coin) => {
          if (Math.abs(coin.x - marioX) < 10 && Math.abs(coin.y - marioY) < 10) {
            setScore((prevScore) => prevScore + 10);
            return false;
          } else {
            return true;
          }
        });
      });
      setPowerUps((prevPowerUps) => {
        return prevPowerUps.filter((powerUp) => {
          if (Math.abs(powerUp.x - marioX) < 10 && Math.abs(powerUp.y - marioY) < 10) {
            setScore((prevScore) => prevScore + 50);
            return false;
          } else {
            return true;
          }
        });
      });
    }, 100);
    return () => clearInterval(intervalId);
  }, [marioX, marioY]);

  // 게임 오버 또는 클리어 시 결과 처리
  useEffect(() => {
    if (enemies.some((enemy) => Math.abs(enemy.x - marioX) < 10 && Math.abs(enemy.y - marioY) < 10)) {
      setGameOver(true);
    } else if (score >= 1000) {
      setGameOver(true);
    }
  }, [enemies, marioX, marioY, score]);

  // 2차원 배열 방어 코드
  const getEnemyAt = (x, y) => {
    if (enemies[y] && enemies[y][x] !== undefined) {
      return enemies[y][x];
    } else {
      return null;
    }
  };

  return (
    <div className="h-screen w-screen bg-gray-200" onKeyDown={handleKeyPress} tabIndex={0}>
      {gameOver ? (
        <div className="text-3xl text-center mt-20">
          {score >= 1000 ? 'Congratulations! You cleared the game!' : 'Game Over'}
        </div>
      ) : (
        <div>
          <div
            className="absolute top-0 left-0"
            style={{
              width: '10px',
              height: '10px',
              backgroundColor: 'red',
              position: 'absolute',
              top: `${marioY}px`,
              left: `${marioX}px`,
            }}
          />
          {enemies.map((enemy, index) => (
            <div
              key={index}
              className="absolute top-0 left-0"
              style={{
                width: '10px',
                height: '10px',
                backgroundColor: 'blue',
                position: 'absolute',
                top: `${enemy.y}px`,
                left: `${enemy.x}px`,
              }}
            />
          ))}
          {coins.map((coin, index) => (
            <div
              key={index}
              className="absolute top-0 left-0"
              style={{
                width: '10px',
                height: '10px',
                backgroundColor: 'yellow',
                position: 'absolute',
                top: `${coin.y}px`,
                left: `${coin.x}px`,
              }}
            />
          ))}
          {powerUps.map((powerUp, index) => (
            <div
              key={index}
              className="absolute top-0 left-0"
              style={{
                width: '10px',
                height: '10px',
                backgroundColor: 'green',
                position: 'absolute',
                top: `${powerUp.y}px`,
                left: `${powerUp.x}px`,
              }}
            />
          ))}
          <div className="text-2xl text-center mt-10">Score: {score}</div>
        </div>
      )}
    </div>
  );
};

export default MarioGame;