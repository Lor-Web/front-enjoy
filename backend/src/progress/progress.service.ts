import { BadRequestException, Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

const SLUG = /^[a-z0-9-]+$/;

@Injectable()
export class ProgressService {
  constructor(private readonly prisma: PrismaService) {}

  async get(userId: string) {
    const [reads, quizzes] = await Promise.all([
      this.prisma.lessonRead.findMany({ where: { userId } }),
      this.prisma.quizProgress.findMany({ where: { userId } }),
    ]);
    const quizAttempts: Record<string, number> = {};
    const passedQuizIds: string[] = [];
    for (const quiz of quizzes) {
      quizAttempts[quiz.slug] = quiz.attempts;
      if (quiz.passed) {
        passedQuizIds.push(quiz.slug);
      }
    }
    return {
      readLessonIds: reads.map((item) => item.slug),
      passedQuizIds,
      quizAttempts,
    };
  }

  async markRead(userId: string, slug: string) {
    assertSlug(slug);
    await this.prisma.lessonRead.createMany({
      data: [{ userId, slug }],
      skipDuplicates: true,
    });
    return this.get(userId);
  }

  async recordQuiz(userId: string, slug: string, passed: boolean) {
    assertSlug(slug);
    const current = await this.prisma.quizProgress.findUnique({
      where: { userId_slug: { userId, slug } },
    });
    const alreadyPassed = current?.passed ?? false;
    const attempts = alreadyPassed
      ? (current?.attempts ?? 0)
      : (current?.attempts ?? 0) + 1;

    await this.prisma.quizProgress.upsert({
      where: { userId_slug: { userId, slug } },
      create: {
        userId,
        slug,
        attempts,
        passed,
        passedAt: passed ? new Date() : null,
      },
      update: {
        attempts,
        passed: alreadyPassed || passed,
        ...(passed && !alreadyPassed ? { passedAt: new Date() } : {}),
      },
    });

    return this.get(userId);
  }

  async getCourse(userId: string, courseSlug: string) {
    assertSlug(courseSlug);
    const row = await this.prisma.courseProgress.findUnique({
      where: { userId_courseSlug: { userId, courseSlug } },
    });
    return serializeCourse(row);
  }

  async startCourse(userId: string, courseSlug: string) {
    assertSlug(courseSlug);
    const row = await this.prisma.courseProgress.upsert({
      where: { userId_courseSlug: { userId, courseSlug } },
      create: { userId, courseSlug },
      update: {},
    });
    return serializeCourse(row);
  }

  async completeCourseSection(
    userId: string,
    courseSlug: string,
    moduleSlug: string,
    sectionSlug: string,
    answers?: number[],
  ) {
    assertSlug(courseSlug);
    assertSlug(moduleSlug);
    assertSlug(sectionSlug);
    const key = `${moduleSlug}/${sectionSlug}`;
    const current = await this.prisma.courseProgress.findUnique({
      where: { userId_courseSlug: { userId, courseSlug } },
    });
    const completed = current?.completed.includes(key)
      ? current.completed
      : [...(current?.completed ?? []), key];
    const nextAnswers = answers
      ? { ...readStoredAnswers(current?.answers), [key]: answers }
      : readStoredAnswers(current?.answers);

    const row = await this.prisma.courseProgress.upsert({
      where: { userId_courseSlug: { userId, courseSlug } },
      create: {
        userId,
        courseSlug,
        completed,
        answers: nextAnswers,
      },
      update: {
        completed,
        answers: nextAnswers,
      },
    });
    return serializeCourse(row);
  }

  async upsertCourse(
    userId: string,
    courseSlug: string,
    dto: {
      startedAt?: string;
      completed?: string[];
      answers?: Record<string, number[]>;
    },
  ) {
    assertSlug(courseSlug);
    const completed = readCompleted(dto.completed);
    const answers = dto.answers ? readCourseAnswers(dto.answers) : undefined;
    const startedAt = dto.startedAt ? new Date(dto.startedAt) : undefined;
    if (startedAt && Number.isNaN(startedAt.getTime())) {
      throw new BadRequestException("Дата старта задана неверно");
    }

    const row = await this.prisma.courseProgress.upsert({
      where: { userId_courseSlug: { userId, courseSlug } },
      create: {
        userId,
        courseSlug,
        startedAt: startedAt ?? new Date(),
        completed,
        answers: answers ?? {},
      },
      update: {
        ...(startedAt ? { startedAt } : {}),
        ...(dto.completed !== undefined ? { completed } : {}),
        ...(dto.answers !== undefined ? { answers: answers ?? {} } : {}),
      },
    });
    return serializeCourse(row);
  }

  async getTask(userId: string, slug: string) {
    assertSlug(slug);
    const row = await this.prisma.taskProgress.findUnique({
      where: { userId_slug: { userId, slug } },
    });
    return serializeTask(row);
  }

  async upsertTask(
    userId: string,
    slug: string,
    dto: {
      codes?: Record<string, string> | null;
      fails?: number;
      done?: boolean;
    },
  ) {
    assertSlug(slug);
    const codes = dto.codes === undefined ? undefined : readCodes(dto.codes);
    const row = await this.prisma.taskProgress.upsert({
      where: { userId_slug: { userId, slug } },
      create: {
        userId,
        slug,
        codes: codes ?? undefined,
        fails: dto.fails ?? 0,
        done: dto.done ?? false,
      },
      update: {
        ...(codes !== undefined
          ? { codes: codes === null ? Prisma.DbNull : codes }
          : {}),
        ...(dto.fails !== undefined ? { fails: dto.fails } : {}),
        ...(dto.done !== undefined ? { done: dto.done } : {}),
      },
    });
    return serializeTask(row);
  }
}

const MAX_CODES_SIZE = 200_000;

function readCodes(value: Record<string, string> | null) {
  if (value === null) {
    return null;
  }
  const result: Record<string, string> = {};
  for (const [path, code] of Object.entries(value)) {
    if (typeof path !== "string" || typeof code !== "string") {
      throw new BadRequestException("Код задачи задан неверно");
    }
    result[path] = code;
  }
  if (JSON.stringify(result).length > MAX_CODES_SIZE) {
    throw new BadRequestException("Код задачи слишком большой");
  }
  return result;
}

function serializeTask(
  row: {
    codes: unknown;
    fails: number;
    done: boolean;
    updatedAt: Date;
  } | null,
) {
  return {
    codes: row && isCodeMap(row.codes) ? row.codes : null,
    fails: row?.fails ?? 0,
    done: row?.done ?? false,
    updatedAt: row?.updatedAt.toISOString() ?? null,
  };
}

function isCodeMap(value: unknown): value is Record<string, string> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }
  return Object.values(value).every((item) => typeof item === "string");
}

function assertSlug(slug: string) {
  if (!SLUG.test(slug)) {
    throw new BadRequestException("Некорректный идентификатор");
  }
}

const SECTION_KEY = /^[a-z0-9-]+\/[a-z0-9-]+$/;
const MAX_COMPLETED = 200;
const MAX_ANSWERS = 40;

function readCompleted(value: string[] | undefined) {
  if (!value) {
    return [];
  }
  if (value.length > MAX_COMPLETED) {
    throw new BadRequestException("Слишком много разделов");
  }
  const result: string[] = [];
  for (const item of value) {
    if (typeof item !== "string" || !SECTION_KEY.test(item)) {
      throw new BadRequestException("Некорректный раздел");
    }
    if (!result.includes(item)) {
      result.push(item);
    }
  }
  return result;
}

function readCourseAnswers(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {} as Record<string, number[]>;
  }
  const result: Record<string, number[]> = {};
  for (const [key, item] of Object.entries(value)) {
    if (!SECTION_KEY.test(key) || !Array.isArray(item)) {
      throw new BadRequestException("Ответы заданы неверно");
    }
    if (item.length > MAX_ANSWERS) {
      throw new BadRequestException("Слишком много ответов");
    }
    if (!item.every((entry) => Number.isInteger(entry))) {
      throw new BadRequestException("Ответы заданы неверно");
    }
    result[key] = item;
  }
  return result;
}

function serializeCourse(
  row: {
    startedAt: Date;
    completed: string[];
    answers: unknown;
  } | null,
) {
  return {
    startedAt: row?.startedAt.toISOString() ?? null,
    completed: row?.completed ?? [],
    answers: row ? readStoredAnswers(row.answers) : {},
  };
}

function readStoredAnswers(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {} as Record<string, number[]>;
  }
  const result: Record<string, number[]> = {};
  for (const [key, item] of Object.entries(value)) {
    if (
      SECTION_KEY.test(key) &&
      Array.isArray(item) &&
      item.every((entry) => Number.isInteger(entry))
    ) {
      result[key] = item;
    }
  }
  return result;
}
