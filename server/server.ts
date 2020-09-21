import * as socketio from "socket.io";

let io = socketio(7000);

const FRAME_RATE = 120;

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
  id: string;
  pos: Vec2Interface;
  vel: Vec2Interface;
  size: SizeInterface;
  constructor(id:string, x:number, y:number) {
    this.id = id;
    this.pos = new Vec2(x, y);
    this.vel = new Vec2(1, 0);
    this.size = {
      width: 32,
      height: 32,
    }
  }
  update() {
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
  }
}

const state = {
  players: []
}


const startGameInterval = () => {
  const gameInterval = setInterval(() => {
    for ( const player of state.players ) {
      player.update();
    }
    io.emit('gameState', state);
  }, 1000 / FRAME_RATE)
}

io.on("connection", client => {
  
  const handleNewConnect = () => {
    const newPlayer = new Entity(client.id, 30, 30);
    state.players.push(newPlayer);
    client.emit('initPlayer', newPlayer);
    startGameInterval();
  }

  const handleDisconnect = () => {
    state.players = state.players.filter(player => player.id !== client.id);
  }

  client.on('newConnect', handleNewConnect);
  client.on('disconnect', handleDisconnect)
});
