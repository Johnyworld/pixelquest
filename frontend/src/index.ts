import { loadImage } from './loaders.js';
import SpriteSheet from './SpriteSheet.js';

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
let level = 'tranquilForest';

['keydown', 'keyup'].forEach(eventName => {
  window.addEventListener(eventName, (e:any) => {
    if ( ['KeyA', 'KeyS', 'KeyD', 'KeyW', 'Space'].includes(e.code) ) {
      e.preventDefault();
      console.log(e.code);
      socket.emit('keyevent', { eventName, code: e.code, level });
    }
  })
})

const newConnect = () => {
  socket.emit('newConnect', level);
}

Promise.all([
  loadImage('/src/images/background.jpg')
]).then(([ image ]) => {

  const handleInitPlayer = (data: Entity) => {
    currentPlayer = data;
  }

  const backgrounds = new SpriteSheet(image, 16, 16);
  backgrounds.defineTile('ground', 0, 0);
  backgrounds.defineTile('dirt', 1, 0);

  const handleUpdate = (data:any) => {

    ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

    data.tiles.forEach((tile:any)=> {
      tile.ranges.forEach((range:any) => {
        for ( let x=range[0]; x<range[1]; x++ ) {
          for ( let y=range[2]; y<range[3]; y++ ) {
            backgrounds.draw(ctx, tile.tile, 16*x, 16*y);
          }
        }
      });
    })

    for ( const entity of data.entities ) {
      ctx.fillStyle = 'red';
      ctx.fillRect(entity.pos.x, entity.pos.y, entity.size.width, entity.size.height);
    }
  }
  
  socket.on('gameState', handleUpdate);
  socket.on('initPlayer', handleInitPlayer);

  newConnect();
}) 