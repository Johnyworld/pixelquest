import { Socket } from "socket.io";
import Entity from '../Entity';
import { State } from '../types';
import Customize from '../Entity';

interface HandleNewConnect {
  client: Socket;
  state: State;
  level: string;
  customize: Customize;
  gameInterval: NodeJS.Timeout;
  startGameInterval: (level:string) => void;
}

interface HandleDisconnect {
  client: Socket;
  state: State;
}


export const handleNewConnect = ({ client, state, level, customize, gameInterval, startGameInterval }: HandleNewConnect) => {
  console.log(state, level)
  clearInterval(gameInterval);
  const newPlayer = new Entity({
    id: client.id, 
    x: Math.random() * 300 + 30, 
    y: Math.random() * 300 + 30,
    customize,
  });
  state[level].entities.push(newPlayer);
  client.join(level);
  startGameInterval(level);
}


export const handleDisconnect = ({ client, state }: HandleDisconnect) => {
  for ( const levelName in state ) {
    state[levelName].entities = state[levelName].entities.filter((entity: Entity) => entity.id !== client.id);
  }
}