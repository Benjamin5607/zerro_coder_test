import React, { useState, useEffect, useCallback, useRef } from 'react';

const App: React.FC = () => {
  const [board, setBoard] = useState<(string | null)[][]>(Array(20).fill(null).map(() => Array(10).fill(null)));
  const [currentPiece, setCurrentPiece] = useState<{
    shape: number[][];
    color: string;
    row: number;
    col: number;
  }>({
    shape: [[1,1],[1,1]],
    color: '#00f',
    row: 0,
    col: 3
  });
  const [nextPiece, setNextPiece] = useState<{
    shape: number[][];
    color: string;
  }>({
    shape: [[1,1],[1,1]],
    color: '#0f0'
  });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [gameSpeed, setGameSpeed] = useState(500);
  const gameLoopRef = useRef<number | null>(null);

  const generatePiece = useCallback((): { shape: number[][], color: string } => {
    const shapes = [
      [[1,1,1,1]], // I
      [[1,1],[1,1]], // O
      [[0,1,0],[1,1,1]], // T
      [[1,0,0],[1,1,1]], // L
      [[0,0,1],[1,1,1]]  // J
    ];
    const colors = ['#00f', '#0f0', '#f00', '#0ff', '#f80'];
    return {
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      color: colors[Math.floor(Math.random() * colors.length)]
    };
  }, []);

  const rotatePiece = useCallback((shape: number[][]): number[][] => {
    return shape[0].map((_, i) => 
      shape.map(row => row[i]).reverse()
    );
  }, []);

  const checkCollision = useCallback((piece: { shape: number[][], row: number, col: number }, board: (string | null)[][]) => {
    for (let r = 0; r < piece.shape.length; r++) {
      for (let c = 0; c < piece.shape[r].length; c++) {
        if (piece.shape[r][c]) {
          const boardRow = piece.row + r;
          const boardCol = piece.col + c;
          
          if (boardRow >= 20 || boardCol < 0 || boardCol >= 10 || 
              (boardRow >= 0 && board[boardRow][boardCol])) {
            return true;
          }
        }
      }
    }
    return false;
  }, []);

  const mergePiece = useCallback((piece: { shape: number[][], row: number, col: number, color: string }, board: (string | null)[][]) => {
    const newBoard = board.map(row => [...row]);
    for (let r = 0; r < piece.shape.length; r++) {
      for (let c = 0; c < piece.shape[r].length; c++) {
        if (piece.shape[r][c]) {
          const boardRow = piece.row + r;
          const boardCol = piece.col + c;
          if (boardRow >= 0) newBoard[boardRow][boardCol] = piece.color;
        }
      }
    }
    return newBoard;
  }, []);

  const clearLines = useCallback((board: (string | null)[][]) => {
    const newBoard = [...board];
    let linesCleared = 0;
    
    for (let r = newBoard.length - 1; r >= 0; r--) {
      if (newBoard[r].every(cell => cell !== null)) {
        newBoard.splice(r, 1);
        newBoard.unshift(Array(10).fill(null));
        linesCleared++;
        r++;
      }
    }
    
    return { board: newBoard, linesCleared };
  }, []);

  const movePiece = useCallback((direction: 'left' | 'right' | 'down' | 'rotate') => {
    if (gameOver || isPaused) return;
    
    const newPiece = { ...currentPiece };
    let moved = false;
    
    switch(direction) {
      case 'left':
        newPiece.col -= 1;
        break;
      case 'right':
        newPiece.col += 1;
        break;
      case 'down':
        newPiece.row += 1;
        break;
      case 'rotate':
        newPiece.shape = rotatePiece(newPiece.shape);
        break;
    }
    
    if (!checkCollision(newPiece, board)) {
      setCurrentPiece(newPiece);
      moved = true;
    } else if (direction === 'down' && !moved) {
      // Lock piece in place
      const newBoard = mergePiece(currentPiece, board);
      const { board: clearedBoard, linesCleared } = clearLines(newBoard);
      setBoard(clearedBoard);
      setScore(prev => prev + linesCleared * 100);
      
      const newNextPiece = generatePiece();
      setCurrentPiece({ 
        shape: newNextPiece.shape, 
        color: newNextPiece.color, 
        row: 0, 
        col: 3 
      });
      setNextPiece(generatePiece());
      
      if (checkCollision(currentPiece, clearedBoard)) {
        setGameOver(true);
      }
    }
  }, [board, currentPiece, gameOver, isPaused, checkCollision, mergePiece, clearLines, generatePiece, rotatePiece]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch(e.key) {
        case 'ArrowLeft': movePiece('left'); break;
        case 'ArrowRight': movePiece('right'); break;
        case 'ArrowDown': movePiece('down'); break;
        case 'ArrowUp': movePiece('rotate'); break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [movePiece]);

  useEffect(() => {
    if (gameOver || isPaused) return;
    
    gameLoopRef.current = window.setInterval(() => {
      movePiece('down');
    }, gameSpeed);
    
    return () => {
      if (gameLoopRef.current)