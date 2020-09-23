export default class SpriteSheet {
  image: HTMLImageElement;
  width: number;
  height: number;
  tiles: Map<string, HTMLCanvasElement>;

  constructor(image: HTMLImageElement, width:number, height:number) {
    this.image = image;
    this.width = width;
    this.height = height;
    this.tiles = new Map<string, HTMLCanvasElement>();
  }

  define(name: string, x: number, y:number, width:number, height:number) {
    const buffer = document.createElement('canvas');
    buffer.width = this.width;
    buffer.height = this.height;
    const ctx = buffer.getContext('2d');
    ctx?.drawImage(
      this.image,
      x,
      y,
      width,
      height,
      0,
      0,
      width,
      height
    )
    this.tiles.set(name, buffer);
  }

  defineTile(name: string, x: number, y:number) {
    this.define(name, x*this.width, y*this.height, this.width, this.height);
  }

  draw(ctx: CanvasRenderingContext2D, name:string, x:number, y:number ) {
    const buffer = this.tiles.get(name);
    buffer && ctx.drawImage(buffer, x, y);
  }
}