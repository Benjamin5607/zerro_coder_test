
// gameLogic.ts
interface Block {
   x: number;
   y: number;
}

class Game {
   private block: Block;
   private rotation: number;

   constructor() {
      this.block = { x: 0, y: 0 };
      this.rotation = 0;
   }

   moveBlock(direction: string) {
      switch (direction) {
         case 'up':
            this.block.y -= 1;
            break;
         case 'down':
            this.block.y += 1;
            break;
         case 'left':
            this.block.x -= 1;
            break;
         case 'right':
            this.block.x += 1;
            break;
      }
   }

   rotateBlock() {
      this.rotation += 1;
   }

   getBlockPosition() {
      return this.block;
   }

   getBlockRotation() {
      return this.rotation;
   }
}

const game = new Game();

// 예시 사용법
game.moveBlock('right'); // 블록을 오른쪽으로 이동
game.moveBlock('up'); // 블록을 위로 이동
game.rotateBlock(); // 블록을 회전

console.log(game.getBlockPosition()); // 블록의 현재 위치
console.log(game.getBlockRotation()); // 블록의 현재 회전 상태
