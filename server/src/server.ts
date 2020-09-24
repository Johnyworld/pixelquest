import * as socketio from "socket.io";
import initialState from "./initialState";
import { handleDisconnect, handleNewConnect } from "./socketHandlers/connecting";
import { handleKeyEvent } from './socketHandlers/inputs';

let io = socketio(7000);

const FRAME_RATE = 120;

const state = initialState;

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
  client.on('disconnect', () => handleDisconnect({ client, state }));
  client.on('keyevent', ({ eventName, code, level }) => handleKeyEvent({ client, state, eventName, code, level }));
});
