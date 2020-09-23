export const loadJSON = (url:string) => {
  return fetch(url).then(r=> r.json());
}
