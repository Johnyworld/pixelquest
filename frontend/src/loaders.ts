export const loadImage:(url: string) => Promise<HTMLImageElement> = (url: string) => {
  return new Promise(resolve => {
    const image = new Image();
    image.onload = () => {
      resolve(image);
    }
    image.src = url;
  }) 
} 