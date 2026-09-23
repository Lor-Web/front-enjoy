import { ChevronsLeft, ChevronsRight } from "lucide-react";
import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import type { ImperativePanelHandle } from "react-resizable-panels";
import {
  findTaskFile,
  type Task,
  type TaskFile,
  taskCodes,
  taskCodesDiffer,
  useTaskProgress,
  visibleTaskFiles,
} from "@/entities/task";
import { Button } from "@/shared/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/shared/ui/resizable";
import { runTaskTests, type TaskTestResult } from "../lib/run-task-tests";
import { TaskActionBar } from "./task-action-bar";
import { TaskDescription } from "./task-description";
import { TaskEditor } from "./task-editor";
import { TaskFileTree } from "./task-file-tree";
import { TaskPreview } from "./task-preview";

const PANES = [
  { id: "description", label: "Описание" },
  { id: "code", label: "Код" },
  { id: "preview", label: "Превью" },
] as const;

type PaneId = (typeof PANES)[number]["id"];

const DESKTOP_QUERY = "(min-width: 1024px)";
const COLLAPSED_SIZE = 3.5;
const FILES_COLLAPSED_SIZE = 7;
const PANE_MIN = {
  description: 16,
  code: 22,
  preview: 18,
  files: 18,
} as const;

export function TaskWorkspace({ task }: { task: Task }) {
  const visible = visibleTaskFiles(task);
  const defaults = useMemo(() => taskCodes(task.files), [task]);
  const {
    codes: saved,
    fails,
    done,
    saveCodes,
    resetCodes,
    recordFail,
    markDone,
  } = useTaskProgress(task.slug);
  const codes = saved ?? defaults;
  const [activePath, setActivePath] = useState(task.activeFile);
  const [showConsole, setShowConsole] = useState(false);
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<TaskTestResult[] | null>(null);
  const previewFiles = useDebounced(codes, 200);
  const isDesktop = useMinWidth(DESKTOP_QUERY);
  const active = findTaskFile(task, activePath);

  useEffect(() => {
    setActivePath(task.activeFile);
    setResults(null);
  }, [task]);

  const onChangeFile = (value: string) => {
    saveCodes({ ...codes, [activePath]: value });
    setResults(null);
  };

  const onReset = () => {
    if (!window.confirm("Вернуть стартовый код? Ваши правки пропадут.")) {
      return;
    }
    resetCodes();
    setResults(null);
  };

  const onSubmit = () => {
    setRunning(true);
    try {
      const next = runTaskTests(task, codes);
      setResults(next);
      if (next.length > 0 && next.every((item) => item.ok)) {
        markDone();
      } else {
        recordFail();
      }
    } catch (caught) {
      setResults([
        {
          id: "runner",
          title: "Не удалось запустить тесты",
          ok: false,
          message: caught instanceof Error ? caught.message : String(caught),
        },
      ]);
      recordFail();
    } finally {
      setRunning(false);
    }
  };

  const description = (
    <TaskDescription key={task.slug} task={task} fails={fails} done={done} />
  );

  const editor = (
    <CodePane
      task={task}
      files={visible}
      codes={codes}
      activePath={activePath}
      readOnly={Boolean(active?.readOnly)}
      onSelect={setActivePath}
      onChange={onChangeFile}
    />
  );

  const preview = (
    <TaskPreview
      files={previewFiles}
      entry={task.entry}
      showConsole={showConsole}
      onToggleConsole={() => setShowConsole((value) => !value)}
    />
  );

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="min-h-0 flex-1">
        {isDesktop ? (
          <DesktopPanes
            description={description}
            editor={editor}
            preview={preview}
          />
        ) : (
          <MobilePanes
            description={description}
            editor={editor}
            preview={preview}
          />
        )}
      </div>
      <TaskActionBar
        running={running}
        canReset={taskCodesDiffer(saved, task.files)}
        results={results}
        onReset={onReset}
        onSubmit={onSubmit}
      />
    </div>
  );
}

function CodePane({
  task,
  files,
  codes,
  activePath,
  readOnly,
  onSelect,
  onChange,
}: {
  task: Task;
  files: TaskFile[];
  codes: Record<string, string>;
  activePath: string;
  readOnly: boolean;
  onSelect: (path: string) => void;
  onChange: (value: string) => void;
}) {
  const filesRef = useRef<ImperativePanelHandle>(null);
  const [filesCollapsed, setFilesCollapsed] = useState(false);

  useEffect(() => {
    setFilesCollapsed(filesRef.current?.isCollapsed() ?? false);
  }, []);

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-full min-h-0"
      autoSaveId={`fe-task-files-${task.slug}`}
    >
      <ResizablePanel
        id="files"
        collapsible
        collapsedSize={FILES_COLLAPSED_SIZE}
        defaultSize={28}
        minSize={PANE_MIN.files}
        className="min-w-0 overflow-hidden"
        onCollapse={() => setFilesCollapsed(true)}
        onExpand={() => setFilesCollapsed(false)}
        ref={filesRef}
      >
        {filesCollapsed ? (
          <ExpandRail
            label="Развернуть файлы"
            side="start"
            onExpand={() => filesRef.current?.resize(PANE_MIN.files)}
          />
        ) : (
          <div className="flex h-full min-h-0 flex-col">
            <div className="flex shrink-0 items-center">
              <p className="text-muted-foreground min-w-0 flex-1 px-3 py-1.5 text-xs font-medium tracking-wide uppercase">
                Файлы
              </p>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="mr-1 size-7"
                aria-label="Свернуть файлы"
                onClick={() => filesRef.current?.collapse()}
              >
                <ChevronsLeft />
              </Button>
            </div>
            <div className="min-h-0 flex-1">
              <TaskFileTree
                files={files}
                activePath={activePath}
                onSelect={onSelect}
              />
            </div>
          </div>
        )}
      </ResizablePanel>
      <ResizableHandle withHandle aria-label="Ширина дерева файлов" />
      <ResizablePanel defaultSize={72} minSize={40} className="min-w-0">
        <TaskEditor
          path={activePath}
          value={codes[activePath] ?? ""}
          readOnly={readOnly}
          onChange={onChange}
        />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

function DesktopPanes({
  description,
  editor,
  preview,
}: {
  description: ReactNode;
  editor: ReactNode;
  preview: ReactNode;
}) {
  const descriptionRef = useRef<ImperativePanelHandle>(null);
  const codeRef = useRef<ImperativePanelHandle>(null);
  const previewRef = useRef<ImperativePanelHandle>(null);
  const [collapsed, setCollapsed] = useState({
    description: false,
    code: false,
    preview: false,
  });

  useEffect(() => {
    setCollapsed({
      description: descriptionRef.current?.isCollapsed() ?? false,
      code: codeRef.current?.isCollapsed() ?? false,
      preview: previewRef.current?.isCollapsed() ?? false,
    });
  }, []);

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-full min-h-0"
      autoSaveId="fe-task-workspace"
    >
      <ResizablePanel
        id="description"
        collapsible
        collapsedSize={COLLAPSED_SIZE}
        defaultSize={28}
        minSize={PANE_MIN.description}
        className="min-w-0 overflow-hidden"
        onCollapse={() =>
          setCollapsed((current) => ({ ...current, description: true }))
        }
        onExpand={() =>
          setCollapsed((current) => ({ ...current, description: false }))
        }
        ref={descriptionRef}
      >
        {collapsed.description ? (
          <ExpandRail
            label="Развернуть описание"
            side="start"
            onExpand={() =>
              descriptionRef.current?.resize(PANE_MIN.description)
            }
          />
        ) : (
          <Pane
            label="Описание"
            onCollapse={() => descriptionRef.current?.collapse()}
          >
            {description}
          </Pane>
        )}
      </ResizablePanel>
      <ResizableHandle withHandle aria-label="Ширина описания и кода" />
      <ResizablePanel
        id="code"
        collapsible
        collapsedSize={COLLAPSED_SIZE}
        defaultSize={40}
        minSize={PANE_MIN.code}
        className="min-w-0 overflow-hidden"
        onCollapse={() =>
          setCollapsed((current) => ({ ...current, code: true }))
        }
        onExpand={() =>
          setCollapsed((current) => ({ ...current, code: false }))
        }
        ref={codeRef}
      >
        {collapsed.code ? (
          <ExpandRail
            label="Развернуть код"
            side="start"
            onExpand={() => codeRef.current?.resize(PANE_MIN.code)}
          />
        ) : (
          <Pane label="Код" onCollapse={() => codeRef.current?.collapse()}>
            {editor}
          </Pane>
        )}
      </ResizablePanel>
      <ResizableHandle withHandle aria-label="Ширина кода и превью" />
      <ResizablePanel
        id="preview"
        collapsible
        collapsedSize={COLLAPSED_SIZE}
        defaultSize={32}
        minSize={PANE_MIN.preview}
        className="min-w-0 overflow-hidden"
        onCollapse={() =>
          setCollapsed((current) => ({ ...current, preview: true }))
        }
        onExpand={() =>
          setCollapsed((current) => ({ ...current, preview: false }))
        }
        ref={previewRef}
      >
        {collapsed.preview ? (
          <ExpandRail
            label="Развернуть превью"
            side="end"
            onExpand={() => previewRef.current?.resize(PANE_MIN.preview)}
          />
        ) : (
          <Pane
            label="Превью"
            collapseSide="end"
            onCollapse={() => previewRef.current?.collapse()}
          >
            {preview}
          </Pane>
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

function MobilePanes({
  description,
  editor,
  preview,
}: {
  description: ReactNode;
  editor: ReactNode;
  preview: ReactNode;
}) {
  const [pane, setPane] = useState<PaneId>("description");

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div
        role="tablist"
        aria-label="Панели задачи"
        className="flex shrink-0 gap-1 border-b px-2 py-2"
      >
        {PANES.map((item) => (
          <Button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={pane === item.id}
            variant={pane === item.id ? "secondary" : "ghost"}
            size="sm"
            className="flex-1"
            onClick={() => setPane(item.id)}
          >
            {item.label}
          </Button>
        ))}
      </div>
      <div className="min-h-0 flex-1">
        {pane === "description" ? description : null}
        {pane === "code" ? editor : null}
        {pane === "preview" ? preview : null}
      </div>
    </div>
  );
}

function Pane({
  label,
  children,
  onCollapse,
  collapseSide = "start",
}: {
  label: string;
  children: ReactNode;
  onCollapse?: () => void;
  collapseSide?: "start" | "end";
}) {
  const CollapseIcon = collapseSide === "end" ? ChevronsRight : ChevronsLeft;

  return (
    <section className="flex h-full min-h-0 flex-col">
      <div className="flex shrink-0 items-center border-b">
        <h2 className="text-muted-foreground min-w-0 flex-1 px-3 py-2 text-xs font-medium tracking-wide uppercase">
          {label}
        </h2>
        {onCollapse ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="mr-1 size-7"
            aria-label={`Свернуть ${label.toLowerCase()}`}
            onClick={onCollapse}
          >
            <CollapseIcon />
          </Button>
        ) : null}
      </div>
      <div className="min-h-0 flex-1">{children}</div>
    </section>
  );
}

function ExpandRail({
  label,
  onExpand,
  side,
}: {
  label: string;
  onExpand: () => void;
  side: "start" | "end";
}) {
  const Icon = side === "end" ? ChevronsLeft : ChevronsRight;

  return (
    <div className="flex h-full items-center justify-center">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-8"
        aria-label={label}
        onClick={onExpand}
      >
        <Icon />
      </Button>
    </div>
  );
}

function useMinWidth(query: string) {
  const [matches, setMatches] = useState(
    () => window.matchMedia(query).matches,
  );

  useEffect(() => {
    const media = window.matchMedia(query);
    const onChange = () => setMatches(media.matches);
    onChange();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

function useDebounced<T>(value: T, delay: number) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(id);
  }, [delay, value]);

  return debounced;
}
