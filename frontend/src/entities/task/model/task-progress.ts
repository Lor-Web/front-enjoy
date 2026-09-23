import { atomWithStorage } from "jotai/utils";

export type TaskProgress = {
  codes?: Record<string, string>;
  fails: number;
  done: boolean;
  updatedAt?: string;
};

export type TaskProgressMap = Record<string, TaskProgress>;

export const taskProgressAtom = atomWithStorage<TaskProgressMap>(
  "fe-task-progress",
  {},
  undefined,
  { getOnInit: true },
);

export const EMPTY_TASK_PROGRESS: TaskProgress = { fails: 0, done: false };

export function mergeTaskProgress(
  local: TaskProgress | undefined,
  remote: {
    codes: Record<string, string> | null;
    fails: number;
    done: boolean;
    updatedAt: string | null;
  },
): TaskProgress {
  const localAt = local?.updatedAt ? Date.parse(local.updatedAt) : 0;
  const remoteAt = remote.updatedAt ? Date.parse(remote.updatedAt) : 0;
  const newerCodes =
    localAt >= remoteAt ? local?.codes : (remote.codes ?? undefined);
  return {
    fails: Math.max(local?.fails ?? 0, remote.fails),
    done: Boolean(local?.done || remote.done),
    codes: newerCodes ?? local?.codes ?? remote.codes ?? undefined,
    updatedAt: new Date(
      Math.max(localAt, remoteAt) || Date.now(),
    ).toISOString(),
  };
}

export function taskProgressNeedsPush(
  local: TaskProgress,
  remote: {
    codes: Record<string, string> | null;
    fails: number;
    done: boolean;
  },
) {
  if (local.fails !== remote.fails || local.done !== remote.done) {
    return true;
  }
  const remoteCodes = remote.codes ?? undefined;
  if (!local.codes && !remoteCodes) {
    return false;
  }
  return JSON.stringify(local.codes) !== JSON.stringify(remoteCodes);
}
