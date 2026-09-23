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
