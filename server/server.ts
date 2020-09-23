import * as socketio from "socket.io";
import { loadLevels } from "./loaders";
import { handleDisconnect, handleNewConnect } from "./src/socketHandlers/connecting";
import { handleKeyEvent } from './src/socketHandlers/inputs';
import State from "./State";

let io = socketio(7000);

const FRAME_RATE = 120;

export const levels = [
  'tranquilForest'
];

Promise.all([
  loadLevels(levels)
]).then(([ levelSpecs ]) => {

  const state = new State(levelSpecs as {[index: string]: any});

  let gameInterval:NodeJS.Timeout;
  const startGameInterval = (level:string) => {
    gameInterval = setInterval(() => {
      for ( const entity of state[level].entities ) {
        entity.update();
      }
      io.in(level).emit('gameState', state[level]);
    }, 1000 / FRAME_RATE)
  }
  
  io.on("connection", client => {
    client.on('newConnect', (level) => handleNewConnect({ client, state, level, gameInterval, startGameInterval }));
    client.on('disconnect', () => handleDisconnect({ client, state, levels }));
    client.on('keyevent', ({ eventName, code, level }) => handleKeyEvent({ client, state, eventName, code, level }));
  });
})
