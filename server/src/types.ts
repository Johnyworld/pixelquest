import Entity from "./Entity";
import { levels } from "./server";

export interface Vec2Interface {
  x: number;
  y: number;
}

export interface SizeInterface {
  width: number;
  height: number;
}

export type Presets = 'forest';

export type Levels = typeof levels[number];


export interface State {
  [index:string]: Level;
}

export interface Level {
  preset: Presets;
  tiles: Tile[];
  entities: Entity[];
}

export interface Tile {
  tile: string;
  ranges: number[][];
}