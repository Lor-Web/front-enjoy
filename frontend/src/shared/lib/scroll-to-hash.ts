export function scrollToHash(hash: string) {
  const id = decodeURIComponent(hash.replace(/^#/, ""));
  if (!id) {
    return false;
  }
  const node = document.getElementById(id);
  if (!node) {
    return false;
  }
  node.scrollIntoView({ block: "start", behavior: "smooth" });
  return true;
}
