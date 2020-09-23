import Entity from "./Entity";

export default class Level {
  preset: string;
  tiles: any[];
  entities: Entity[];

  constructor (levelSpec: any) {
    this.preset = levelSpec.preset;
    this.tiles = levelSpec.tiles;
    this.entities = [];
  }
}