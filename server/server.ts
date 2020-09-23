import * as socketio from "socket.io";
import Entity from "./Entity";

let io = socketio(7000);

const FRAME_RATE = 120;

const levels = [
  'tranquilForest'
];

const state = {
  players: []
} as { players:any[] }

let gameInterval:NodeJS.Timeout;
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

  const handleKeyEvent = ({ eventName, code }:any) => {
    const currentPlayer = state.players.find(player => player.id === client.id);
    if ( eventName === 'keydown' ) {
      switch( code ) {
        case 'KeyA': currentPlayer.vel = { x: -1, y: 0 }; return;
        case 'KeyS': currentPlayer.vel = { x: 0, y: 1 }; return;
        case 'KeyD': currentPlayer.vel = { x: 1, y: 0 }; return;
        case 'KeyW': currentPlayer.vel = { x: 0, y: -1 }; return;
      }
    } else {
      currentPlayer.vel = { x: 0, y: 0 };
    }
  }

  client.on('newConnect', handleNewConnect);
  client.on('disconnect', handleDisconnect);
  client.on('keyevent', handleKeyEvent);
});
