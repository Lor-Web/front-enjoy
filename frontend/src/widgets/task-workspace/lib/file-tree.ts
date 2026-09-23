export type FileTreeNode =
  | { kind: "dir"; name: string; path: string; children: FileTreeNode[] }
  | { kind: "file"; name: string; path: string };

export function buildFileTree(paths: string[]): FileTreeNode[] {
  const root: FileTreeNode[] = [];

  for (const full of [...paths].sort()) {
    const parts = full.replace(/^\//, "").split("/").filter(Boolean);
    let level = root;
    let acc = "";
    for (const [index, part] of parts.entries()) {
      acc += `/${part}`;
      const isFile = index === parts.length - 1;
      if (isFile) {
        if (!level.some((node) => node.kind === "file" && node.path === acc)) {
          level.push({ kind: "file", name: part, path: acc });
        }
        continue;
      }
      let dir = level.find((node) => node.kind === "dir" && node.path === acc);
      if (dir?.kind !== "dir") {
        dir = { kind: "dir", name: part, path: acc, children: [] };
        level.push(dir);
      }
      level = dir.children;
    }
  }

  return sortTree(root);
}

function sortTree(nodes: FileTreeNode[]): FileTreeNode[] {
  return [...nodes]
    .sort((a, b) => {
      if (a.kind !== b.kind) {
        return a.kind === "dir" ? -1 : 1;
      }
      return a.name.localeCompare(b.name, "ru");
    })
    .map((node) =>
      node.kind === "dir"
        ? { ...node, children: sortTree(node.children) }
        : node,
    );
}
