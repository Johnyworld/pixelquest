import { Socket } from "socket.io";
import Entity from "../Entity";
import { State } from "../types";

interface HandleNewConnect {
  client: Socket;
  state: State;
  level: string;
  gameInterval: NodeJS.Timeout;
  startGameInterval: (level:string) => void;
}

interface HandleDisconnect {
  client: Socket;
  state: State;
}


export const handleNewConnect = ({ client, state, level, gameInterval, startGameInterval }: HandleNewConnect) => {
  console.log(state, level)
  clearInterval(gameInterval);
  const newPlayer = new Entity(client.id, Math.random() * 300 + 30, Math.random() * 300 + 30);
  state[level].entities.push(newPlayer);
  client.join(level);
  client.emit('initPlayer', newPlayer);
  startGameInterval(level);
}


export const handleDisconnect = ({ client, state }: HandleDisconnect) => {
  for ( const levelName in state ) {
    state[levelName].entities = state[levelName].entities.filter((entity: Entity) => entity.id !== client.id);
  }
}