import { routes } from "./routes";

export const DOC_TECHS = [
  {
    id: "react",
    title: "React",
    description: "Библиотека для пользовательских интерфейсов",
    href: routes.docsReact,
    hex: "#61DAFB",
  },
  {
    id: "javascript",
    title: "JavaScript",
    description: "Язык программирования веба",
    href: routes.docsJavascript,
    hex: "#F7DF1E",
  },
] as const;

export type DocTechId = (typeof DOC_TECHS)[number]["id"];
export type DocTech = (typeof DOC_TECHS)[number];

function pathMatches(pathname: string, base: string) {
  return pathname === base || pathname.startsWith(`${base}/`);
}

export function isDocTechActive(id: DocTechId, pathname: string) {
  if (id === "react") {
    return pathMatches(pathname, routes.docsReact);
  }
  return pathMatches(pathname, routes.docsJavascript);
}

export function isDocsSection(pathname: string) {
  return pathMatches(pathname, routes.docs);
}
