declare const io: typeof import('socket.io');
const socket = io('http://localhost:7000');

socket.on('connect', () => console.log('connexted!!!'));

const SCREEN_WIDTH = 640;
const SCREEN_HEIGHT = 480;

interface Vec2Interface {
  x: number;
  y: number;
}

interface SizeInterface {
  width: number;
  height: number;
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
  vel: Vec2Interface;
  size: SizeInterface;
  constructor(ctx:CanvasRenderingContext2D, x:number, y:number) {
    this.ctx = ctx;
    this.pos = new Vec2(x, y);
    this.vel = new Vec2(1, 0);
    this.size = {
      width: 32,
      height: 32,
    }
  }

  draw(ctx:CanvasRenderingContext2D) {
    ctx.fillStyle = 'red';
    ctx.fillRect(this.pos.x, this.pos.y, this.size.width, this.size.height);
  }

  update(ctx: CanvasRenderingContext2D) {
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
    this.draw(ctx);
  }
}

const canvas = <HTMLCanvasElement> document.getElementById('canvas');
canvas.width = SCREEN_WIDTH;
canvas.height = SCREEN_HEIGHT;
const ctx = canvas.getContext('2d')!;

const player = new Entity(ctx, 50, 50);

window.addEventListener('keydown', (e:any) => {
  e.preventDefault();
  console.log(e.code);
  if ( e.code === 'KeyA' ) {
    player.vel = { x: -1, y: 0 };
  } else if ( e.code === 'KeyS' ) {
    player.vel = { x: 0, y: 1 };
  } else if ( e.code === 'KeyD' ) {
    player.vel = { x: 1, y: 0 };
  } else if ( e.code === 'KeyW' ) {
    player.vel = { x: 0, y: -1 };
  } else if ( e.code === 'Space' ) {
    player.vel = { x: 0, y: 0 };
  }
})

const update = () => {
  ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
  ctx.fillStyle = '#e5e5e5';
  ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
  player.update(ctx);
  requestAnimationFrame(update);
}

update();

