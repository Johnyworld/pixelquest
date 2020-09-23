import Level from "./Level";

export default class State {
  [index: string]: any;
  
  constructor(levelSpecs: {[index: string]: any}) {
    for ( const level in levelSpecs ) {
      this.define(level, levelSpecs[level]);
    }
  }

  define(name:string, levelSpec:any) {
    this[name] = new Level(levelSpec);
  }
}