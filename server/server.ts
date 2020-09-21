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
    this.vel = new Vec2(0, 0);
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

let gameInterval;
const startGameInterval = () => {
  gameInterval = setInterval(() => {
    for ( const player of state.players ) {
      player.update();
    }
    io.emit('gameState', state);
  }, 1000 / FRAME_RATE)
}

io.on("connection", client => {
  
  const handleNewConnect = () => {
    clearInterval(gameInterval);
    const newPlayer = new Entity(client.id, Math.random() * 300 + 30, Math.random() * 300 + 30);
    state.players.push(newPlayer);
    client.emit('initPlayer', newPlayer);
    startGameInterval();
  }

  const handleDisconnect = () => {
    state.players = state.players.filter(player => player.id !== client.id);
  }

  const handleKeyDown = ( code ) => {
    const currentPlayer = state.players.find(player => player.id === client.id);
    switch( code ) {
      case 'KeyA': currentPlayer.vel = { x: -1, y: 0 }; return;
      case 'KeyS': currentPlayer.vel = { x: 0, y: 1 }; return;
      case 'KeyD': currentPlayer.vel = { x: 1, y: 0 }; return;
      case 'KeyW': currentPlayer.vel = { x: 0, y: -1 }; return;
      case 'Space': currentPlayer.vel = { x: 0, y: 0 }; return;
    }
  }

  client.on('newConnect', handleNewConnect);
  client.on('disconnect', handleDisconnect);
  client.on('keydown', handleKeyDown);
});
