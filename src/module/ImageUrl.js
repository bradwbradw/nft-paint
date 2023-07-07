function ImageUrl(id) {
  var url = localStorage.getItem("image#" + id);
  // it's json
  return JSON.parse(url);
}

export default ImageUrl;
