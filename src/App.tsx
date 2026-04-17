import React, { useState, useEffect } from 'react';

function App() {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!name) return;
    if (!count) return;
    if (!error) return;

    // 예외 처리 로직
    try {
      if (typeof count !== 'number') {
        setError('Count must be a number');
        return;
      }
      if (typeof name !== 'string') {
        setError('Name must be a string');
        return;
      }
    } catch (e) {
      setError(e.message);
      return;
    }
  }, [count, name, error]);

  const handleIncrement = () => {
    if (!count) return;
    setCount(count + 1);
  };

  const handleDecrement = () => {
    if (!count) return;
    setCount(count - 1);
  };

  const handleChangeName = (e) => {
    if (!e.target.value) return;
    setName(e.target.value);
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-4">Counter App</h1>
      <div className="flex justify-between mb-4">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleDecrement}
          disabled={!count}
        >
          -
        </button>
        <span className="text-3xl font-bold">{count}</span>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleIncrement}
          disabled={!count}
        >
          +
        </button>
      </div>
      <input
        type="text"
        value={name}
        onChange={handleChangeName}
        placeholder="Enter your name"
        className="w-full p-2 mb-4 border border-gray-400 rounded"
      />
      <p className="text-lg font-bold mb-4">
        Hello, {name}!
      </p>
      {error && (
        <p className="text-red-500 mb-4">
          {error}
        </p>
      )}
    </div>
  );
}

export default App;