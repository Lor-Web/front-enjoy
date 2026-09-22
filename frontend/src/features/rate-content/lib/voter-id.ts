const COOKIE = "fe-voter";
const MAX_AGE = 60 * 60 * 24 * 365;

let memoryId: string | undefined;

export function getVoterId() {
  if (typeof document === "undefined") {
    return "";
  }
  const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE}=([^;]*)`));
  if (match?.[1]) {
    return decodeURIComponent(match[1]);
  }
  if (memoryId) {
    return memoryId;
  }
  const id = crypto.randomUUID();
  memoryId = id;
  // biome-ignore lint/suspicious/noDocumentCookie: анонимный голос без localStorage
  document.cookie = `${COOKIE}=${encodeURIComponent(id)}; Path=/; Max-Age=${MAX_AGE}; SameSite=Lax`;
  return id;
}
