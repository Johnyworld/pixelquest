import { levels } from "./server";

export interface Vec2Interface {
  x: number;
  y: number;
}

export interface SizeInterface {
  width: number;
  height: number;
}

export type Levels = typeof levels[number];

