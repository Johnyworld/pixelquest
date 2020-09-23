import { loadImage } from './loaders.js';

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

['keydown', 'keyup'].forEach(eventName => {
  window.addEventListener(eventName, (e:any) => {
    if ( ['KeyA', 'KeyS', 'KeyD', 'KeyW', 'Space'].includes(e.code) ) {
      e.preventDefault();
      console.log(e.code);
      socket.emit('keyevent', { eventName, code: e.code });
    }
  })
})


const newConnect = () => {
  socket.emit('newConnect');
}


Promise.all([
  loadImage('/src/images/background.jpg')
]).then(([ image ]) => {

  const handleInitPlayer = (data: Entity) => {
    currentPlayer = data;
  }
  
  const handleUpdate = (data:any) => {
    ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    ctx.drawImage(image, 0, 0, 16, 16, 0, 0, 16, 16);
    for ( const player of data.players ) {
      ctx.fillStyle = 'red';
      ctx.fillRect(player.pos.x, player.pos.y, player.size.width, player.size.height);
    }
  }
  
  socket.on('gameState', handleUpdate);
  socket.on('initPlayer', handleInitPlayer);

  newConnect();
}) 