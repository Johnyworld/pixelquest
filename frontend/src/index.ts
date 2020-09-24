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
  const customize = {
    sex: ['male', 'female'][Math.floor(Math.random() * 2)],
  }
  socket.emit('newConnect', { level, customize });
}

Promise.all([
  loadImage('/src/images/background.jpg'),
  loadImage('/src/images/entitysprite.png')
]).then(([ backgroundSprite, entitySprite ]) => {

  const backgrounds = new SpriteSheet(backgroundSprite, 16, 16);
  backgrounds.defineTile('ground', 0, 0);
  backgrounds.defineTile('dirt', 1, 0);

  const entities = new SpriteSheet(entitySprite, 16, 24);
  entities.defineTile('female', 0, 0);
  entities.defineTile('male', 0, 4);

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
    
    data.entities.sort((a:any, b:any)=> a.pos.y > b.pos.y ? 1 : -1);

    for ( const entity of data.entities ) {
      entities.draw(ctx, entity.sex, entity.pos.x, entity.pos.y)
    }
  }
  
  socket.on('gameState', handleUpdate);

  newConnect();
}) 