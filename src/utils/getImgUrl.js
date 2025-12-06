function getImgUrl(name) {
  if (!name) return "";
  // If it's a Base64 string or an external URL, use it directly
  if (name.startsWith("data:") || name.startsWith("http")) {
    return name;
  }
  // Otherwise, look in the local assets folder
  return new URL(`../assets/phones/${name}`, import.meta.url).href;
}

export { getImgUrl };