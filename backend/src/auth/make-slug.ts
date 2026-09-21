import { randomBytes } from "node:crypto";

export function makeSlug(name: string) {
  const base =
    name
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "") || "user";
  return `${base}-${randomBytes(3).toString("hex")}`;
}
