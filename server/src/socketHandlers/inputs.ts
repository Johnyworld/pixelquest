import { Socket } from "socket.io";
import Entity from "../../Entity";
import State from "../../State";

interface Args {
  client: Socket;
  state: State;
  eventName: string;
  code: string;
  level: string;
}

export const handleKeyEvent = ({ client, state, eventName, code, level }: Args) => {
  const currentPlayer = state[level].entities.find((entity: Entity) => entity.id === client.id);
  if ( currentPlayer ) {
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
}