import {
  ChevronDown,
  ChevronRight,
  File,
  Folder,
  FolderOpen,
} from "lucide-react";
import { useState } from "react";
import type { TaskFile } from "@/entities/task";
import { cn } from "@/shared/lib/utils";
import { buildFileTree, type FileTreeNode } from "../lib/file-tree";

type TaskFileTreeProps = {
  files: TaskFile[];
  activePath: string;
  onSelect: (path: string) => void;
};

export function TaskFileTree({
  files,
  activePath,
  onSelect,
}: TaskFileTreeProps) {
  const tree = buildFileTree(files.map((file) => file.path));

  return (
    <nav aria-label="Файлы задачи" className="h-full overflow-y-auto py-2">
      <ul className="px-1">
        {tree.map((node) => (
          <TreeItem
            key={node.path}
            node={node}
            files={files}
            activePath={activePath}
            onSelect={onSelect}
            depth={0}
          />
        ))}
      </ul>
    </nav>
  );
}

function TreeItem({
  node,
  files,
  activePath,
  onSelect,
  depth,
}: {
  node: FileTreeNode;
  files: TaskFile[];
  activePath: string;
  onSelect: (path: string) => void;
  depth: number;
}) {
  const [open, setOpen] = useState(true);
  const pad = { paddingLeft: `${0.5 + depth * 0.75}rem` };

  if (node.kind === "dir") {
    return (
      <li>
        <button
          type="button"
          style={pad}
          className="hover:bg-accent/70 flex w-full items-center gap-1.5 rounded-md px-1.5 py-1 text-left text-xs"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? (
            <ChevronDown className="text-muted-foreground size-3.5 shrink-0" />
          ) : (
            <ChevronRight className="text-muted-foreground size-3.5 shrink-0" />
          )}
          {open ? (
            <FolderOpen className="size-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
          ) : (
            <Folder className="size-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
          )}
          <span className="truncate">{node.name}</span>
        </button>
        {open ? (
          <ul>
            {node.children.map((child) => (
              <TreeItem
                key={child.path}
                node={child}
                files={files}
                activePath={activePath}
                onSelect={onSelect}
                depth={depth + 1}
              />
            ))}
          </ul>
        ) : null}
      </li>
    );
  }

  const meta = files.find((file) => file.path === node.path);
  const active = activePath === node.path;

  return (
    <li>
      <button
        type="button"
        style={pad}
        className={cn(
          "flex w-full items-center gap-1.5 rounded-md px-1.5 py-1 text-left text-xs",
          active
            ? "bg-accent text-foreground"
            : "text-muted-foreground hover:bg-accent/70 hover:text-foreground",
        )}
        aria-current={active ? "page" : undefined}
        onClick={() => onSelect(node.path)}
      >
        <span className="w-3.5 shrink-0" aria-hidden />
        <File className="size-3.5 shrink-0" />
        <span className="truncate">{node.name}</span>
        {meta?.readOnly ? (
          <span className="text-muted-foreground ml-auto shrink-0 text-[10px]">
            чтение
          </span>
        ) : null}
      </button>
    </li>
  );
}
