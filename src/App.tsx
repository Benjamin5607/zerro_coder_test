import React from 'react';

export default function App() {
  const { state, updateState } = useTetrisState();

  const handleBlockMove = (direction) => {
    const newBlock = moveBlock(state.currentBlock, direction);
    updateState({ currentBlock: newBlock });
  };

  const handleBlockRotation = (rotation) => {
    const newBlock = rotateBlock(state.currentBlock, rotation);
    updateState({ currentBlock: newBlock });
  };

  const handleBlockFall = () => {
    const newBlock = fallBlock(state.currentBlock, state.grid);
    updateState({ currentBlock: newBlock });
  };

  const moveBlock = (block, direction) => {
    switch (direction) {
      case 'left':
        return { ...block, x: block.x - 1 };
      case 'right':
        return { ...block, x: block.x + 1 };
      default:
        return block;
    }
  };

  const rotateBlock = (block, rotation) => {
    switch (rotation) {
      case 'clockwise':
        return {
          x: block.y,
          y: -block.x,
          color: block.color,
          shape: block.shape,
        };
      case 'counter-clockwise':
        return {
          x: -block.y,
          y: block.x,
          color: block.color,
          shape: block.shape,
        };
      default:
        return block;
    }
  };

  const fallBlock = (block, grid) => {
    const newBlock = { ...block, y: block.y + 1 };
    if (newBlock.y + newBlock.shape.length > grid.length) {
      return { ...block, y: grid.length - newBlock.shape.length };
    }
    return newBlock;
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="grid grid-cols-10 gap-2">
        {state.grid.map((row, y) => (
          <div key={y} className="flex flex-row">
            {row.map((block, x) => (
              <Block
                key={x}
                x={x}
                y={y}
                color={block.color}
                shape={block.shape}
              />
            ))}
          </div>
        ))}
      </div>
      <BlockRotation block={state.currentBlock} rotation={state.rotation} />
      <BlockFall block={state.currentBlock} grid={state.grid} updateState={updateState} />
      <Score state={state} updateState={updateState} />
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => handleBlockMove('left')}
      >
        Left
      </button>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => handleBlockMove('right')}
      >
        Right
      </button>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => handleBlockRotation('clockwise')}
      >
        Clockwise
      </button>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => handleBlockFall()}
      >
        Fall
      </button>
    </div>
  );
}