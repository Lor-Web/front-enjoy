import { BadRequestException, Injectable } from "@nestjs/common";
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
}

function assertSlug(slug: string) {
  if (!SLUG.test(slug)) {
    throw new BadRequestException("Некорректный идентификатор");
  }
}
