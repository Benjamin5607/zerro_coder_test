
// src/utils/constants.ts
export const GAME_WIDTH = 10;
export const GAME_HEIGHT = 20;
export const BLOCK_SIZE = 30;
export const COLORS = [
   'red',
   'orange',
   'yellow',
   'green',
   'blue',
   'indigo',
   'violet'
];
export const SHAPES = {
   I: [
      [1, 1, 1, 1]
   ],
   J: [
      [1, 0, 0],
      [1, 1, 1]
   ],
   L: [
      [0, 0, 1],
      [1, 1, 1]
   ],
   O: [
      [1, 1],
      [1, 1]
   ],
   S: [
      [0, 1, 1],
      [1, 1, 0]
   ],
   T: [
      [0, 1, 0],
      [1, 1, 1]
   ],
   Z: [
      [1, 1, 0],
      [0, 1, 1]
   ]
};
export const DIRECTIONS = {
   UP: [0, -1],
   DOWN: [0, 1],
   LEFT: [-1, 0],
   RIGHT: [1, 0]
};
