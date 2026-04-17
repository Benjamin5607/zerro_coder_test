export default function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [blocks, setBlocks] = useState([]);
  const [currentBlock, setCurrentBlock] = useState({
    type: 'I',
    x: 5,
    y: 0,
    rotation: 0,
  });
  const [nextBlock, setNextBlock] = useState({
    type: 'I',
    x: 5,
    y: 0,
    rotation: 0,
  });

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setBlocks([]);
    setCurrentBlock({
      type: 'I',
      x: 5,
      y: 0,
      rotation: 0,
    });
    setNextBlock({
      type: 'I',
      x: 5,
      y: 0,
      rotation: 0,
    });
  };

  const endGame = () => {
    setGameStarted(false);
    setGameOver(true);
  };

  const moveBlockLeft = () => {
    if (currentBlock.x > 0) {
      setCurrentBlock((prevBlock) => ({ ...prevBlock, x: prevBlock.x - 1 }));
    }
  };

  const moveBlockRight = () => {
    if (currentBlock.x < 10) {
      setCurrentBlock((prevBlock) => ({ ...prevBlock, x: prevBlock.x + 1 }));
    }
  };

  const rotateBlock = () => {
    if (currentBlock.rotation < 3) {
      setCurrentBlock((prevBlock) => ({ ...prevBlock, rotation: prevBlock.rotation + 1 }));
    }
  };

  const placeBlock = () => {
    if (blocks.length > 0) {
      const newBlocks = [...blocks];
      newBlocks.push(currentBlock);
      setBlocks(newBlocks);
      setScore((prevScore) => prevScore + 1);
    }
  };

  const resetGame = () => {
    startGame();
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-gray-200 p-4 rounded-md shadow-md">
          <h2 className="text-lg font-bold mb-2">Tetris Game</h2>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={startGame}
          >
            Start Game
          </button>
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            onClick={endGame}
          >
            End Game
          </button>
          <div className="flex flex-col items-center justify-center mt-4">
            <div className="w-full max-w-md mx-auto">
              <div className="bg-gray-200 p-4 rounded-md shadow-md">
                <h2 className="text-lg font-bold mb-2">Score: {score}</h2>
                <div className="flex flex-col items-center justify-center">
                  <div className="w-full max-w-md mx-auto">
                    <div className="bg-gray-200 p-4 rounded-md shadow-md">
                      <h2 className="text-lg font-bold mb-2">Blocks:</h2>
                      <ul>
                        {blocks.map((block, index) => (
                          <li key={index}>
                            <div
                              className="bg-gray-400 w-4 h-4 rounded-md"
                              style={{
                                transform: `translate(${block.x * 20}px, ${block.y * 20}px) rotate(${block.rotation * 90}deg)`,
                              }}
                            />
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}