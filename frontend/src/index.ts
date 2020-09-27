import { loadImage } from './loaders.js';
import SpriteSheet from './SpriteSheet.js';

declare const io: typeof import('socket.io');
const socket = io('http://localhost:7000');

const SCREEN_WIDTH = 360;
const SCREEN_HEIGHT = 240;

const mouse = {
  x: 0, y: 0
}

window.addEventListener('mousemove', (e:MouseEvent) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
})

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
      const a = mouse.x - entity.pos.x;
      const b = mouse.y - entity.pos.y;
      const range = Math.floor(Math.sqrt( a*a + b*b ));
      const cosA = a / range;
      const degree = cosA * 90;

      console.log(a, b, range, degree);
      // console.log(entity.pos, mouse, range, cosA );
    }
  }
  
  socket.on('gameState', handleUpdate);

  newConnect();
}) 