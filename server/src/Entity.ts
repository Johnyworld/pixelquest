import { SizeInterface, Vec2Interface } from "./types";
import Vec2 from "./Vec2";

export default class Entity {
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
