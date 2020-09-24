import { SizeInterface, Vec2Interface } from "./types";
import Vec2 from "./Vec2";

export interface Customize {
  sex: 'male' | 'female'
}
interface Args {
  id: string;
  x: number;
  y: number;
  customize: Customize
}

export default class Entity {
  id: string;
  pos: Vec2Interface;
  vel: Vec2Interface;
  size: SizeInterface;
  sex: 'male' | 'female';
  constructor({ id, x, y, customize }: Args) {
    this.id = id;
    this.pos = new Vec2(x, y);
    this.vel = new Vec2(0, 0);
    this.size = {
      width: 16,
      height: 24,
    }
    this.sex = customize.sex;
  }
  update() {
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
  }
}
