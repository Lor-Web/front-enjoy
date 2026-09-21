const WORDS_PER_MINUTE = 140;
const SECONDS_PER_CODE_BLOCK = 40;
const SECONDS_PER_QUESTION = 90;

export function countWords(text: string) {
  return text
    .trim()
    .split(/[\s\u00A0]+/)
    .filter((part) => /[\p{L}\p{N}]/u.test(part)).length;
}

export function estimateLessonMinutes(words: number, codeBlocks: number) {
  const minutes =
    words / WORDS_PER_MINUTE + (codeBlocks * SECONDS_PER_CODE_BLOCK) / 60;
  return Math.max(2, Math.round(minutes));
}

export function estimateQuizMinutes(questionCount: number) {
  return Math.max(2, Math.round((questionCount * SECONDS_PER_QUESTION) / 60));
}

export function formatMinutes(minutes: number) {
  const mod10 = minutes % 10;
  const mod100 = minutes % 100;
  let unit = "минут";
  if (mod10 === 1 && mod100 !== 11) {
    unit = "минуту";
  } else if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    unit = "минуты";
  }
  return `${minutes} ${unit}`;
}
