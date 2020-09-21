declare const io: typeof import('socket.io');
const socket = io('http://localhost:7000');

socket.on('connect', () => console.log('connexted!!!'));

interface Vec2Interface {
  x: number;
  y: number;
}

class Vec2 implements Vec2Interface {
  x: number;
  y: number;
  constructor(x:number, y:number) {
    this.x = x;
    this.y = y;
  }
}

class Entity {
  ctx: CanvasRenderingContext2D;
  pos: Vec2Interface;
  size: Vec2Interface;
  constructor(ctx:CanvasRenderingContext2D, x:number, y:number) {
    this.ctx = ctx;
    this.pos = new Vec2(x, y);
    this.size = new Vec2(16, 16);
  }

  draw(ctx:CanvasRenderingContext2D) {
    ctx.fillStyle = 'red';
    ctx.fillRect(this.pos.x, this.pos.y, this.size.x, this.size.y);
  }
}

const canvas = <HTMLCanvasElement> document.getElementById('canvas');
canvas.width = 640;
canvas.height = 640;
const ctx = canvas.getContext('2d')!;

// ctx?.fillRect(0, 0, 100, 100);

const player = new Entity(ctx, 50, 50);

ctx.fillStyle = '#e5e5e5';
ctx.fillRect(0, 0, 640, 640);
player.draw(ctx);

