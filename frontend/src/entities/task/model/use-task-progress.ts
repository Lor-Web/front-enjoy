import { useAtom, useAtomValue } from "jotai";
import { useCallback, useEffect, useRef } from "react";
import { tokenAtom } from "@/features/auth";
import { getTaskProgress, putTaskProgress } from "../api/task-progress-api";
import {
  EMPTY_TASK_PROGRESS,
  mergeTaskProgress,
  type TaskProgress,
  taskProgressAtom,
  taskProgressNeedsPush,
} from "./task-progress";

const SYNC_DELAY = 1200;

export function useTasksProgress() {
  return useAtomValue(taskProgressAtom);
}

export function useTaskProgress(slug: string) {
  const token = useAtomValue(tokenAtom);
  const [map, setMap] = useAtom(taskProgressAtom);
  const progress = map[slug] ?? EMPTY_TASK_PROGRESS;
  const pending = useRef<TaskProgress | null>(null);
  const timer = useRef(0);

  const persistLocal = useCallback(
    (next: {
      codes?: Record<string, string>;
      fails?: number;
      done?: boolean;
      resetCodes?: boolean;
    }) => {
      const updatedAt = new Date().toISOString();
      setMap((current) => {
        const prev = current[slug] ?? EMPTY_TASK_PROGRESS;
        const entry: TaskProgress = {
          fails: next.fails ?? prev.fails,
          done: next.done ?? prev.done,
          codes: next.resetCodes ? undefined : (next.codes ?? prev.codes),
          updatedAt,
        };
        pending.current = entry;
        return { ...current, [slug]: entry };
      });
    },
    [setMap, slug],
  );

  const push = useCallback(
    (entry: TaskProgress) => {
      if (!token) {
        return;
      }
      void putTaskProgress(slug, {
        codes: entry.codes ?? null,
        fails: entry.fails,
        done: entry.done,
      }).catch(() => undefined);
    },
    [slug, token],
  );

  const schedulePush = useCallback(() => {
    if (!token) {
      return;
    }
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      if (pending.current) {
        push(pending.current);
      }
    }, SYNC_DELAY);
  }, [push, token]);

  const flushPush = useCallback(() => {
    window.clearTimeout(timer.current);
    if (pending.current) {
      push(pending.current);
    }
  }, [push]);

  useEffect(() => {
    if (!token) {
      return;
    }
    let cancelled = false;
    void getTaskProgress(slug)
      .then((remote) => {
        if (cancelled) {
          return;
        }
        setMap((current) => {
          const merged = mergeTaskProgress(current[slug], remote);
          pending.current = merged;
          if (taskProgressNeedsPush(merged, remote)) {
            void putTaskProgress(slug, {
              codes: merged.codes ?? null,
              fails: merged.fails,
              done: merged.done,
            }).catch(() => undefined);
          }
          return { ...current, [slug]: merged };
        });
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [setMap, slug, token]);

  useEffect(() => {
    return () => {
      window.clearTimeout(timer.current);
      if (token && pending.current) {
        void putTaskProgress(slug, {
          codes: pending.current.codes ?? null,
          fails: pending.current.fails,
          done: pending.current.done,
        }).catch(() => undefined);
      }
    };
  }, [slug, token]);

  return {
    codes: progress.codes,
    fails: progress.fails,
    done: progress.done,
    saveCodes: useCallback(
      (codes: Record<string, string>) => {
        persistLocal({ codes });
        schedulePush();
      },
      [persistLocal, schedulePush],
    ),
    resetCodes: useCallback(() => {
      persistLocal({ resetCodes: true });
      flushPush();
    }, [flushPush, persistLocal]),
    recordFail: useCallback(() => {
      persistLocal({ fails: progress.fails + 1 });
      flushPush();
    }, [flushPush, persistLocal, progress.fails]),
    markDone: useCallback(() => {
      persistLocal({ done: true });
      flushPush();
    }, [flushPush, persistLocal]),
  };
}
