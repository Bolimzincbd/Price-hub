function getImgUrl(name) {
  return new URL(`../assets/phones/${name}`, import.meta.url);
}

export { getImgUrl };
