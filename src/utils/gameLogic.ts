
// src/utils/gameLogic.ts
interface Tetromino {
  type: string;
  color: string;
  blocks: number[][];
}

class GameLogic {
  private tetrominos: Tetromino[] = [
    {
      type: 'I',
      color: 'cyan',
      blocks: [
        [1, 1, 1, 1]
      ]
    },
    {
      type: 'J',
      color: 'blue',
      blocks: [
        [1, 0, 0],
        [1, 1, 1]
      ]
    },
    {
      type: 'L',
      color: 'orange',
      blocks: [
        [0, 0, 1],
        [1, 1, 1]
      ]
    },
    {
      type: 'O',
      color: 'yellow',
      blocks: [
        [1, 1],
        [1, 1]
      ]
    },
    {
      type: 'S',
      color: 'green',
      blocks: [
        [0, 1, 1],
        [1, 1, 0]
      ]
    },
    {
      type: 'T',
      color: 'purple',
      blocks: [
        [0, 1, 0],
        [1, 1, 1]
      ]
    },
    {
      type: 'Z',
      color: 'red',
      blocks: [
        [1, 1, 0],
        [0, 1, 1]
      ]
    }
  ];

  private grid: number[][] = Array(20).fill(0).map(() => Array(10).fill(0));
  private currentTetromino: Tetromino | null = null;
  private currentTetrominoX: number = 0;
  private currentTetrominoY: number = 0;

  constructor() {
    this.startGame();
  }

  startGame() {
    this.spawnTetromino();
    this.updateGrid();
  }

  spawnTetromino() {
    const randomIndex = Math.floor(Math.random() * this.tetrominos.length);
    this.currentTetromino = this.tetrominos[randomIndex];
    this.currentTetrominoX = 3;
    this.currentTetrominoY = 0;
  }

  updateGrid() {
    this.grid = Array(20).fill(0).map(() => Array(10).fill(0));
    if (this.currentTetromino) {
      for (let i = 0; i < this.currentTetromino.blocks.length; i++) {
        for (let j = 0; j < this.currentTetromino.blocks[i].length; j++) {
          if (this.currentTetromino.blocks[i][j] === 1) {
            this.grid[this.currentTetrominoY + i][this.currentTetrominoX + j] = 1;
          }
        }
      }
    }
  }

  moveLeft() {
    if (this.currentTetrominoX > 0) {
      this.currentTetrominoX--;
      this.updateGrid();
    }
  }

  moveRight() {
    if (this.currentTetrominoX < 10 - this.currentTetromino.blocks[0].length) {
      this.currentTetrominoX++;
      this.updateGrid();
    }
  }

  moveDown() {
    if (this.currentTetrominoY < 20 - this.currentTetromino.blocks.length) {
      this.currentTetrominoY++;
      this.updateGrid();
    } else {
      this.checkForLines();
      this.spawnTetromino();
    }
  }

  checkForLines() {
    for (let i = 0; i < this.grid.length; i++) {
      let isFullLine = true;
      for (let j = 0; j < this.grid[i].length; j++) {
        if (this.grid[i][j] === 0) {
          isFullLine = false;
          break;
        }
      }
      if (isFullLine) {
        this.grid.splice(i, 1);
        this.grid.unshift(Array(10).fill(0));
      }
    }
  }
}

const game = new GameLogic();
