declare const io: typeof import('socket.io');
const socket = io('http://localhost:7000');

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

interface Entity {
  id: number;
  pos: Vec2Interface;
  vel: Vec2Interface;
  size: SizeInterface
}

const canvas = <HTMLCanvasElement> document.getElementById('canvas');
canvas.width = SCREEN_WIDTH;
canvas.height = SCREEN_HEIGHT;
const ctx = canvas.getContext('2d')!;

let currentPlayer = {} as Entity;

// window.addEventListener('keydown', (e:any) => {
//   e.preventDefault();
//   console.log(e.code);
//   if ( e.code === 'KeyA' ) {
//     player.vel = { x: -1, y: 0 };
//   } else if ( e.code === 'KeyS' ) {
//     player.vel = { x: 0, y: 1 };
//   } else if ( e.code === 'KeyD' ) {
//     player.vel = { x: 1, y: 0 };
//   } else if ( e.code === 'KeyW' ) {
//     player.vel = { x: 0, y: -1 };
//   } else if ( e.code === 'Space' ) {
//     player.vel = { x: 0, y: 0 };
//   }
// })

const newConnect = () => {
  socket.emit('newConnect');
}

const handleInitPlayer = (data: Entity) => {
  currentPlayer = data;
}

const handleUpdate = (data:any) => {
  ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
  for ( const player of data.players ) {
    ctx.fillStyle = 'red';
    ctx.fillRect(player.pos.x, player.pos.y, player.size.width, player.size.height);
  }
}

socket.on('gameState', handleUpdate);
socket.on('initPlayer', handleInitPlayer);
newConnect();
