export function lessonSlugFromPath(filePath: string | undefined) {
  if (!filePath) {
    return "";
  }
  const match = filePath.replaceAll("\\", "/").match(/\/lessons\/([^/]+)\//);
  return match?.[1] ?? "";
}

export function prefixedHeadingId(lessonSlug: string, baseId: string) {
  return lessonSlug ? `${lessonSlug}-${baseId}` : baseId;
}
