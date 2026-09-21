import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { UpsertProgressDto } from "./dto/upsert-progress.dto";

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

  async merge(userId: string, dto: UpsertProgressDto) {
    const current = await this.get(userId);
    const readLessonIds = unique([
      ...current.readLessonIds,
      ...dto.readLessonIds,
    ]);
    const passedQuizIds = unique([
      ...current.passedQuizIds,
      ...dto.passedQuizIds,
    ]);
    const slugs = unique([
      ...Object.keys(current.quizAttempts),
      ...Object.keys(dto.quizAttempts ?? {}),
      ...passedQuizIds,
    ]);

    await this.prisma.$transaction(async (tx) => {
      if (readLessonIds.length > 0) {
        await tx.lessonRead.createMany({
          data: readLessonIds.map((slug) => ({ userId, slug })),
          skipDuplicates: true,
        });
      }

      for (const slug of slugs) {
        const incoming = Number(dto.quizAttempts?.[slug] ?? 0);
        const existing = current.quizAttempts[slug] ?? 0;
        const attempts = Math.max(
          existing,
          Number.isFinite(incoming) ? Math.max(0, Math.floor(incoming)) : 0,
        );
        const passed = passedQuizIds.includes(slug);
        const wasPassed = current.passedQuizIds.includes(slug);
        await tx.quizProgress.upsert({
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
            passed,
            ...(passed && !wasPassed ? { passedAt: new Date() } : {}),
          },
        });
      }
    });

    return this.get(userId);
  }
}

function unique(values: string[]) {
  return [...new Set(values.filter(Boolean))];
}
