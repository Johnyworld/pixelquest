const fs = require('fs');

export const loadJSON = (url:string) => {
  return JSON.parse(fs.readFileSync(url));
}

export const loadLevels = (levels: string[]) => {
  return new Promise(resolve => {
    let state:{[index:string]: any} = {};
    
    levels.forEach(levelName => {
      const levelSpec = loadJSON(`./data/levels/${levelName}.json`);
      state[levelName] = levelSpec;
    })

    resolve(state);
  })
}