export const routes = {
  home: "/",
  catalog: "/learn/react",
  lesson: (slug: string, options?: { view?: string; hash?: string }) => {
    const params = new URLSearchParams();
    if (options?.view && options.view !== "short") {
      params.set("view", options.view);
    }
    const query = params.toString();
    const hash = options?.hash ? `#${options.hash}` : "";
    return `/learn/react/${slug}${query ? `?${query}` : ""}${hash}`;
  },
  quiz: (slug: string) => `/learn/react/${slug}/quiz`,
} as const;
