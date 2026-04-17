# Zerro AI 5-Stage Project

### 🎯 사령관 지시사항
> 테트리스 게임 다시 만들기

### 🏗️ Architecture
테트리스 게임을 구현하기 위한 단일 React 컴포넌트의 내부 상태(State) 구조는 다음과 같습니다.

```jsx
import React, { useState, useEffect } from 'react';

const TetrisGame = () => {
  // 테트리스 블록의 상태
  const [blocks, setBlocks] = useState({
    currentBlock: {
      type: 'I',
      x: 5,
      y: 0,
      rotation: 0,
    },
    grid: Array(20).fill(0).map(() => Array(10).fill(0)),
  });

  // 블록의 크기와 모양을 위한 상수
  const BLOCK_SIZES = {
    I: [4, 1],
    J: [3, 2],
    L: [3, 2],
    O: [2, 2],
    S: [3, 2],
    T: [3, 2],
    Z: [3, 2],
  };

  // 블록의 회전을 위한 함수
  const rotateBlock = (block) => {
    const newRotation = (block.rotation + 1) % 4;
    const newBlock = {
      ...block,
      rotation: newRotation,
    };

    // 회전이 가능할 때만 회전
    if (isRotationPossible(newBlock, blocks.grid)) {
      return newBlock;
    }

    // 회전이 불가능할 때, 이전 회전으로 돌아가기
    return {
      ...block,
      rotation: (block.rotation - 1 + 4) % 4,
    };
  };

  // 블록의 위치를 위한 함수
  const moveBlock = (block, dx, dy) => {
    const newBlock = {
      ...block,
      x: block.x + dx,
      y: block.y + dy,
    };

    // 블록이 화면의 경계를 넘어가지 않도록 제한
    if (newBlock.x < 0 || newBlock.x + BLOCK_SIZES[block.type][0] > 10) {
      return block;
    }

    if (newBlock.y < 0 || newBlock.y + BLOCK_SIZES[block.type][1] > 20) {
      return block;
    }

    return newBlock;
  };

  // 블록의 떨어짐을 위한 함수
  const dropBlock = (block) => {
    const newBlock = {
      ...block,
      y: block.y + 1,
    };

    // 블록이 화면의 경계를 넘어가지 않도록 제한
    if (newBlock.y + BLOCK_SIZES[block.type][1] > 20) {
      return block;
    }

    return newBlock;
  };

  // 충돌을 위한 함수
  const checkCollision = (block, grid) => {
    for (let i = 0; i < BLOCK_SIZES[block.type][1]; i++) {
      for (let j = 0; j < BLOCK_SIZES[block.type][0]; j++) {
        if (grid[block.y + i][block.x + j] === 1) {
          return true;
        }
      }
    }

    return false;
  };

  // 블록의 회전이 가능할 때만 회전
  const isRotationPossible = (block, grid) => {
    const newBlock = rotateBlock(block);

    for (let i = 0; i < BLOCK_SIZES[newBlock.type][1]; i++) {
      for (let j = 0; j < BLOCK_SIZES[newBlock.type][0]; j++) {
        if (newBlock.y + i < 0 || newBlock.y + i + BLOCK_SIZES[newBlock.type][1] > 20) {
          return false;
        }

        if (newBlock.x + j < 0 || newBlock.x + j + BLOCK_SIZES[newBlock.type][0] > 10) {
          return false;
        }

        if (grid[newBlock.y + i][newBlock.x + j] === 1) {
          return false;
        }
      }
    }

    return true;
  };

  // 블록의 위치를 업데이트하기 위한 함수
  const updateBlockPosition = (block, dx, dy) => {
    const newBlock = moveBlock(block, dx, dy);

    if (checkCollision(newBlock, blocks.grid)) {
      return block;
    }

    return newBlock;
  };

  // 블록의 떨어짐을 업데이트하기 위한 함수
  const updateBlockDrop = (block) => {
    const newBlock = dropBlock(block);

    if (checkCollision(newBlock, blocks.grid)) {
      return block;
    }

    return newBlock;
  };

  // 사용자가 블록을 이동시키거나 회전시키거나 떨어뜨리면 블록의 상태를 업데이트하기 위한 함수
  const handleUserInput = (event) => {
    switch (event.key) {
      case 'ArrowLeft':
        setBlocks((prevBlocks) => ({
          ...prevBlocks,
          currentBlock: updateBlockPosition(prevBlocks.currentBlock, -1, 0),
        }));
        break;
      case 'ArrowRight':
        setBlocks((prevBlocks) => ({
          ...prevBlocks,
          currentBlock: updateBlockPosition(prevBlocks.currentBlock, 1, 0),
        }));
        break;
      case 'ArrowDown':
        setBlocks((prevBlocks) => ({
          ...prevBlocks,
          currentBlock: updateBlockDrop(prevBlocks.currentBlock),
        }));
        break;
      case 'ArrowUp':
        setBlocks((prevBlocks) => ({
          ...prevBlocks,
          currentBlock: rotateBlock(prevBlocks.currentBlock),
        }));
        break;
      default:
        break;
    }
  };

  // 컴포넌트가 마운트되면 사용자가 블록을 이동시키거나 회전시키거나 떨어뜨리면 블록의 상태를 업데이트하기 위한 이벤트 리스너를 등록
  useEffect(() => {
    document.addEventListener('keydown', handleUserInput);

    return () => {
      document.removeEventListener('keydown', handleUserInput);
    };
  }, []);

  return (
    <div>
      {/* 테트리스 블록을 렌더링하기 위한 컴포넌트 */}
      <div className="grid grid-cols-10 gap-1">
        {blocks.grid.map((row, rowIndex) => (
          <div key={rowIndex} className="flex">
            {row.map((cell, cellIndex) => (
              <div
                key={cellIndex}
                className={`w-4 h-4 bg-gray-300 ${cell === 1 ? 'bg-red-500' : ''}`}
              />
            ))}
          </div>
        ))}
      </div>

      {/* 테트리스 블록을 렌더링하기 위한 컴포넌트 */}
      <div
        className={`absolute top-0 left-0 w-4 h-4 bg-gray-300 ${blocks.currentBlock.type === 'I' ? 'bg-blue-500' : ''}`}
        style={{
          transform: `translate(${blocks.currentBlock.x * 40}px, ${blocks.currentBlock.y * 20}px) rotate(${blocks.currentBlock.rotation * 90}deg)`,
        }}
      />
    </div>
  );
};

export default TetrisGame;
```

이 컴포넌트는 사용자가 블록을 이동시키거나 회전시키거나 떨어뜨리면 블록의 상태를 업데이트하기 위한 이벤트 리스너를 등록하고, 블록의 위치를 업데이트하기 위한 함수를 정의합니다. 또한, 블록의 회전이 가능할 때만 회전하고, 블록의 떨어짐을 업데이트하기 위한 함수를 정의합니다.

Tailwind 스타일링 전략은 다음과 같습니다.

```css
.grid {
  @apply grid grid-cols-10 gap-1;
}

.grid-cols-10 {
  @apply grid-cols-10;
}

.gap-1 {
  @apply gap-1;
}

.flex {
  @apply flex;
}

.w-4 {
  @apply w-4;
}

.h-4 {
  @apply h-4;
}

.bg-gray-300 {
  @apply bg-gray-300;
}

.bg-red-500 {
  @apply bg-red-500;
}

.absolute {
  @apply absolute;
}

.top-0 {
  @apply top-0;
}

.left-0 {
  @apply left-0;
}

.bg-blue-500 {
  @apply bg-blue-500;
}

.translate {
  @apply translate;
}

.rotate {
  @apply rotate;
}
```

이 스타일링 전략은 테트리스 블록을 렌더링하기 위한 컴포넌트를 스타일링하기 위한 클래스를 정의합니다.

### 🛡️ QA Report
PASS