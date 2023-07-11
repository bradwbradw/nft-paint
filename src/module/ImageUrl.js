export function localStorageKey(id) {
  return "image#" + id;
}

export function ImageUrl(id) {
  var url = localStorage.getItem(localStorageKey(id));
  // it's json
  return JSON.parse(url);
}
