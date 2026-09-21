import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { MentorshipStatus, RatingAspect } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { CreateMentorshipDto } from "./dto/create-mentorship.dto";
import { UpsertRatingDto } from "./dto/upsert-rating.dto";
import {
  MAX_MENTORS,
  MAX_STUDENTS,
  RATE_AFTER_MS,
  RATE_UPDATE_EVERY_MS,
} from "./limits";
import { mentorshipInclude, serializeMentorship } from "./serialize";

const openStatuses = [MentorshipStatus.pending, MentorshipStatus.active];

@Injectable()
export class MentorshipsService {
  constructor(private readonly prisma: PrismaService) {}

  async request(studentId: string, dto: CreateMentorshipDto) {
    const mentor = await this.prisma.user.findUnique({
      where: { slug: dto.mentorSlug },
    });
    if (!mentor?.mentorOffered) {
      throw new NotFoundException("Ментор не найден или не принимает учеников");
    }
    if (mentor.id === studentId) {
      throw new BadRequestException("Нельзя отправить заявку самому себе");
    }

    const existing = await this.prisma.mentorship.findUnique({
      where: {
        mentorId_studentId: { mentorId: mentor.id, studentId },
      },
      include: mentorshipInclude,
    });

    if (existing?.status === MentorshipStatus.pending) {
      throw new ConflictException("Заявка уже отправлена");
    }
    if (existing?.status === MentorshipStatus.active) {
      throw new ConflictException("Вы уже учитесь у этого ментора");
    }

    const openAsStudent = await this.prisma.mentorship.count({
      where: { studentId, status: { in: openStatuses } },
    });
    if (openAsStudent >= MAX_MENTORS) {
      throw new BadRequestException(
        `Можно учиться максимум у ${MAX_MENTORS} менторов одновременно`,
      );
    }

    const activeStudents = await this.prisma.mentorship.count({
      where: { mentorId: mentor.id, status: MentorshipStatus.active },
    });
    if (activeStudents >= MAX_STUDENTS) {
      throw new BadRequestException("У этого ментора уже максимум учеников");
    }

    const row = existing
      ? await this.prisma.mentorship.update({
          where: { id: existing.id },
          data: { status: MentorshipStatus.pending, startedAt: null },
          include: mentorshipInclude,
        })
      : await this.prisma.mentorship.create({
          data: {
            mentorId: mentor.id,
            studentId,
            status: MentorshipStatus.pending,
          },
          include: mentorshipInclude,
        });

    return serializeMentorship(this.prisma, row, studentId);
  }

  async incoming(mentorId: string) {
    const rows = await this.prisma.mentorship.findMany({
      where: { mentorId, status: MentorshipStatus.pending },
      include: mentorshipInclude,
      orderBy: { createdAt: "desc" },
    });
    return Promise.all(
      rows.map((row) => serializeMentorship(this.prisma, row, mentorId)),
    );
  }

  async students(mentorId: string) {
    const rows = await this.prisma.mentorship.findMany({
      where: { mentorId, status: MentorshipStatus.active },
      include: mentorshipInclude,
      orderBy: { updatedAt: "desc" },
    });
    return Promise.all(
      rows.map(async (row) => ({
        ...(await serializeMentorship(this.prisma, row, mentorId)),
        progress: await this.progressSummary(row.studentId),
      })),
    );
  }

  async mentors(studentId: string) {
    const rows = await this.prisma.mentorship.findMany({
      where: {
        studentId,
        status: {
          in: [
            MentorshipStatus.pending,
            MentorshipStatus.active,
            MentorshipStatus.ended,
          ],
        },
      },
      include: mentorshipInclude,
      orderBy: { updatedAt: "desc" },
    });
    return Promise.all(
      rows.map((row) => serializeMentorship(this.prisma, row, studentId)),
    );
  }

  async getOne(viewerId: string, id: string) {
    const row = await this.prisma.mentorship.findUnique({
      where: { id },
      include: mentorshipInclude,
    });
    if (!row) {
      throw new NotFoundException("Связь не найдена");
    }
    if (row.mentorId !== viewerId) {
      throw new ForbiddenException("Прогресс ученика видит только ментор");
    }
    return {
      ...(await serializeMentorship(this.prisma, row, viewerId)),
      progress: await this.progressDetailed(row.studentId),
    };
  }

  async accept(mentorId: string, id: string) {
    const activeStudents = await this.prisma.mentorship.count({
      where: { mentorId, status: MentorshipStatus.active },
    });
    if (activeStudents >= MAX_STUDENTS) {
      throw new BadRequestException(
        `Можно взять максимум ${MAX_STUDENTS} учеников`,
      );
    }
    return this.setStatus(id, mentorId, MentorshipStatus.active, [
      MentorshipStatus.pending,
    ]);
  }

  async decline(mentorId: string, id: string) {
    return this.setStatus(id, mentorId, MentorshipStatus.declined, [
      MentorshipStatus.pending,
    ]);
  }

  async end(userId: string, id: string) {
    const row = await this.prisma.mentorship.findUnique({
      where: { id },
      include: mentorshipInclude,
    });
    if (!row) {
      throw new NotFoundException("Связь не найдена");
    }
    if (row.mentorId !== userId && row.studentId !== userId) {
      throw new ForbiddenException("Нельзя завершить чужую связь");
    }
    if (row.status !== MentorshipStatus.active) {
      throw new BadRequestException("Завершить можно только активную связь");
    }
    const updated = await this.prisma.mentorship.update({
      where: { id },
      data: { status: MentorshipStatus.ended },
      include: mentorshipInclude,
    });
    return serializeMentorship(this.prisma, updated, userId);
  }

  async rate(userId: string, id: string, dto: UpsertRatingDto) {
    const row = await this.prisma.mentorship.findUnique({
      where: { id },
      include: mentorshipInclude,
    });
    if (!row) {
      throw new NotFoundException("Связь не найдена");
    }
    if (
      row.status !== MentorshipStatus.active &&
      row.status !== MentorshipStatus.ended
    ) {
      throw new BadRequestException("Оценить можно после начала менторства");
    }

    const startedAt = row.startedAt;
    if (!startedAt || Date.now() - startedAt.getTime() < RATE_AFTER_MS) {
      throw new BadRequestException(
        "Оценку и отзыв можно оставить спустя 3 дня после начала менторства",
      );
    }

    const isMentor = row.mentorId === userId;
    const isStudent = row.studentId === userId;
    if (!isMentor && !isStudent) {
      throw new ForbiddenException("Нельзя оценить чужую связь");
    }
    if (dto.aspect === RatingAspect.asMentor && !isStudent) {
      throw new ForbiddenException("Оценку ментору ставит ученик");
    }
    if (dto.aspect === RatingAspect.asStudent && !isMentor) {
      throw new ForbiddenException("Оценку ученику ставит ментор");
    }

    const existing = row.ratings.find(
      (rating) => rating.fromUserId === userId && rating.aspect === dto.aspect,
    );
    if (
      existing &&
      Date.now() - existing.updatedAt.getTime() < RATE_UPDATE_EVERY_MS
    ) {
      throw new BadRequestException("Обновлять оценку можно раз в сутки");
    }

    const toUserId =
      dto.aspect === RatingAspect.asMentor ? row.mentorId : row.studentId;

    await this.prisma.rating.upsert({
      where: {
        mentorshipId_fromUserId_aspect: {
          mentorshipId: id,
          fromUserId: userId,
          aspect: dto.aspect,
        },
      },
      create: {
        mentorshipId: id,
        fromUserId: userId,
        toUserId,
        aspect: dto.aspect,
        score: dto.score,
        comment: dto.comment?.trim() || null,
      },
      update: {
        score: dto.score,
        comment: dto.comment?.trim() || null,
      },
    });

    const updated = await this.prisma.mentorship.findUniqueOrThrow({
      where: { id },
      include: mentorshipInclude,
    });
    return serializeMentorship(this.prisma, updated, userId);
  }

  async progressSummary(userId: string) {
    const [reads, quizzes] = await Promise.all([
      this.prisma.lessonRead.findMany({ where: { userId } }),
      this.prisma.quizProgress.findMany({ where: { userId } }),
    ]);
    return {
      readLessonIds: reads.map((item) => item.slug),
      passedQuizIds: quizzes
        .filter((item) => item.passed)
        .map((item) => item.slug),
    };
  }

  async progressDetailed(userId: string) {
    const [reads, quizzes] = await Promise.all([
      this.prisma.lessonRead.findMany({
        where: { userId },
        orderBy: { readAt: "asc" },
      }),
      this.prisma.quizProgress.findMany({
        where: { userId },
        orderBy: { passedAt: "asc" },
      }),
    ]);
    return {
      reads: reads.map((item) => ({
        slug: item.slug,
        readAt: item.readAt.toISOString(),
      })),
      quizzes: quizzes.map((item) => ({
        slug: item.slug,
        attempts: item.attempts,
        passed: item.passed,
        passedAt: item.passedAt?.toISOString() ?? null,
      })),
    };
  }

  private async setStatus(
    id: string,
    mentorId: string,
    status: MentorshipStatus,
    allowed: MentorshipStatus[],
  ) {
    const row = await this.prisma.mentorship.findUnique({
      where: { id },
      include: mentorshipInclude,
    });
    if (!row) {
      throw new NotFoundException("Связь не найдена");
    }
    if (row.mentorId !== mentorId) {
      throw new ForbiddenException("Это может сделать только ментор");
    }
    if (!allowed.includes(row.status)) {
      throw new BadRequestException("Это действие сейчас недоступно");
    }
    const updated = await this.prisma.mentorship.update({
      where: { id },
      data: {
        status,
        startedAt:
          status === MentorshipStatus.active ? new Date() : row.startedAt,
      },
      include: mentorshipInclude,
    });
    return serializeMentorship(this.prisma, updated, mentorId);
  }
}
