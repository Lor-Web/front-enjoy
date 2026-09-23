import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { HomeworkReviewStatus, MentorshipStatus } from "@prisma/client";
import {
  GithubService,
  type HomeworkChecksState,
} from "../github/github.service";
import { PrismaService } from "../prisma/prisma.service";
import { normalizeHomeworkPullUrl, parseHomeworkPullUrl } from "./pull-url";
import { homeworkRepoName } from "./templates";

@Injectable()
export class CoursesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly github: GithubService,
  ) {}

  async getRepository(userId: string, courseSlug: string) {
    this.requireTemplate(courseSlug);
    const repo = await this.liveRepository(userId, courseSlug);
    return repo ? this.serialize(repo) : null;
  }

  async createRepository(userId: string, courseSlug: string) {
    const templateRepo = this.requireTemplate(courseSlug);
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
    });
    if (!user.githubLogin) {
      throw new ConflictException("Сначала подключите GitHub в профиле");
    }

    const existing = await this.liveRepository(userId, courseSlug);
    if (existing) {
      return this.serialize(existing);
    }

    const name = `fe-${courseSlug}-${user.slug}`.slice(0, 100);
    const owner = this.github.templatesOwner();
    let created = await this.github
      .createFromTemplate({
        templateRepo,
        name,
        description: `Домашние задания курса ${courseSlug}`,
      })
      .catch(async (error: unknown) => {
        const existingGithub = await this.github.getRepo(owner, name);
        if (existingGithub) {
          return existingGithub;
        }
        throw error;
      });

    if (!created.html_url || !created.owner?.login) {
      created =
        (await this.github.getRepo(owner, name)) ??
        ({
          name,
          html_url: `https://github.com/${owner}/${name}`,
          owner: { login: owner },
        } satisfies {
          name: string;
          html_url: string;
          owner: { login: string };
        });
    }

    await this.github.inviteCollaborator({
      owner: created.owner.login,
      repo: created.name,
      username: user.githubLogin,
    });

    const repo = await this.prisma.courseRepository.upsert({
      where: { userId_courseSlug: { userId, courseSlug } },
      create: {
        userId,
        courseSlug,
        owner: created.owner.login,
        name: created.name,
        htmlUrl: created.html_url,
      },
      update: {
        owner: created.owner.login,
        name: created.name,
        htmlUrl: created.html_url,
      },
    });
    return this.serialize(repo);
  }

  async getHomework(userId: string, courseSlug: string, moduleSlug: string) {
    this.requireTemplate(courseSlug);
    this.requireModuleSlug(moduleSlug);
    const row = await this.prisma.courseHomeworkSubmission.findUnique({
      where: {
        userId_courseSlug_moduleSlug: { userId, courseSlug, moduleSlug },
      },
      include: {
        mentor: { select: { id: true, name: true, slug: true } },
        user: { select: { id: true, name: true, slug: true } },
      },
    });
    if (!row) {
      return null;
    }
    return this.presentHomework(row);
  }

  async submitHomework(
    userId: string,
    courseSlug: string,
    moduleSlug: string,
    prUrl: string,
    mentorId?: string,
  ) {
    this.requireTemplate(courseSlug);
    this.requireModuleSlug(moduleSlug);
    const repo = await this.liveRepository(userId, courseSlug);
    if (!repo) {
      throw new ConflictException("Сначала создайте репозиторий курса");
    }

    const reviewerId = mentorId?.trim() || null;
    if (reviewerId) {
      const mentorship = await this.prisma.mentorship.findFirst({
        where: {
          studentId: userId,
          mentorId: reviewerId,
          status: MentorshipStatus.active,
        },
      });
      if (!mentorship) {
        throw new ConflictException(
          "Сдать работу можно только активному ментору",
        );
      }
    }

    const normalized = normalizeHomeworkPullUrl(prUrl, {
      owner: repo.owner,
      name: repo.name,
    });

    const row = await this.prisma.courseHomeworkSubmission.upsert({
      where: {
        userId_courseSlug_moduleSlug: { userId, courseSlug, moduleSlug },
      },
      create: {
        userId,
        courseSlug,
        moduleSlug,
        prUrl: normalized,
        mentorId: reviewerId,
        status: HomeworkReviewStatus.pending,
      },
      update: {
        prUrl: normalized,
        mentorId: reviewerId,
        status: HomeworkReviewStatus.pending,
        submittedAt: new Date(),
        reviewedAt: null,
      },
      include: {
        mentor: { select: { id: true, name: true, slug: true } },
        user: { select: { id: true, name: true, slug: true } },
      },
    });
    return this.presentHomework(row);
  }

  async listInbox(mentorId: string) {
    const rows = await this.prisma.courseHomeworkSubmission.findMany({
      where: {
        mentorId,
        status: HomeworkReviewStatus.pending,
      },
      include: {
        mentor: { select: { id: true, name: true, slug: true } },
        user: { select: { id: true, name: true, slug: true } },
      },
      orderBy: { submittedAt: "desc" },
    });
    return Promise.all(rows.map((row) => this.presentHomework(row)));
  }

  async reviewHomework(
    mentorId: string,
    submissionId: string,
    decision: "accepted" | "rejected",
  ) {
    const row = await this.prisma.courseHomeworkSubmission.findUnique({
      where: { id: submissionId },
      include: {
        mentor: { select: { id: true, name: true, slug: true } },
        user: { select: { id: true, name: true, slug: true } },
      },
    });
    if (!row || row.mentorId !== mentorId) {
      throw new NotFoundException("Сдача не найдена");
    }
    if (row.status !== HomeworkReviewStatus.pending) {
      throw new ConflictException("Эту работу уже проверили");
    }

    const presented = await this.presentHomework(row);
    if (decision === "accepted" && presented.checks !== "success") {
      throw new ConflictException(
        "Принять можно, когда тесты на pull request зелёные",
      );
    }

    const updated = await this.prisma.courseHomeworkSubmission.update({
      where: { id: row.id },
      data: {
        status:
          decision === "accepted"
            ? HomeworkReviewStatus.accepted
            : HomeworkReviewStatus.rejected,
        reviewedAt: new Date(),
      },
      include: {
        mentor: { select: { id: true, name: true, slug: true } },
        user: { select: { id: true, name: true, slug: true } },
      },
    });
    return this.presentHomework(updated, presented.checks);
  }

  private async liveRepository(userId: string, courseSlug: string) {
    const repo = await this.prisma.courseRepository.findUnique({
      where: { userId_courseSlug: { userId, courseSlug } },
    });
    if (!repo) {
      return null;
    }
    const github = await this.github.getRepo(repo.owner, repo.name);
    if (github) {
      return repo;
    }
    await this.prisma.$transaction([
      this.prisma.courseHomeworkSubmission.deleteMany({
        where: { userId, courseSlug },
      }),
      this.prisma.courseRepository.delete({
        where: { id: repo.id },
      }),
    ]);
    return null;
  }

  private requireModuleSlug(moduleSlug: string) {
    if (!/^[a-z0-9-]+$/.test(moduleSlug)) {
      throw new BadRequestException("Некорректный модуль");
    }
  }

  private requireTemplate(courseSlug: string) {
    const repo = homeworkRepoName(courseSlug);
    if (!repo) {
      throw new NotFoundException("Для этого курса нет шаблона домашки");
    }
    return repo;
  }

  private serialize(repo: {
    courseSlug: string;
    owner: string;
    name: string;
    htmlUrl: string;
    createdAt: Date;
  }) {
    return {
      courseSlug: repo.courseSlug,
      owner: repo.owner,
      name: repo.name,
      htmlUrl: repo.htmlUrl,
      createdAt: repo.createdAt.toISOString(),
    };
  }

  private async presentHomework(
    row: {
      id: string;
      userId: string;
      courseSlug: string;
      moduleSlug: string;
      prUrl: string;
      submittedAt: Date;
      reviewedAt: Date | null;
      status: HomeworkReviewStatus;
      mentorId: string | null;
      mentor: { id: string; name: string; slug: string } | null;
      user: { id: string; name: string; slug: string };
    },
    knownChecks?: HomeworkChecksState,
  ) {
    const checks = knownChecks ?? (await this.checksFor(row.prUrl));
    let current = row;
    if (
      !row.mentorId &&
      row.status === HomeworkReviewStatus.pending &&
      checks === "success"
    ) {
      current = await this.prisma.courseHomeworkSubmission.update({
        where: { id: row.id },
        data: {
          status: HomeworkReviewStatus.accepted,
          reviewedAt: new Date(),
        },
        include: {
          mentor: { select: { id: true, name: true, slug: true } },
          user: { select: { id: true, name: true, slug: true } },
        },
      });
    }
    return this.serializeHomework(current, checks);
  }

  private async checksFor(prUrl: string): Promise<HomeworkChecksState> {
    const parsed = parseHomeworkPullUrl(prUrl);
    if (!parsed) {
      return "unknown";
    }
    try {
      return await this.github.getPullChecks(
        parsed.owner,
        parsed.name,
        parsed.number,
      );
    } catch {
      return "unknown";
    }
  }

  private serializeHomework(
    row: {
      id: string;
      courseSlug: string;
      moduleSlug: string;
      prUrl: string;
      submittedAt: Date;
      reviewedAt: Date | null;
      status: HomeworkReviewStatus;
      mentorId: string | null;
      mentor: { id: string; name: string; slug: string } | null;
      user: { id: string; name: string; slug: string };
    },
    checks: HomeworkChecksState,
  ) {
    return {
      id: row.id,
      courseSlug: row.courseSlug,
      moduleSlug: row.moduleSlug,
      prUrl: row.prUrl,
      submittedAt: row.submittedAt.toISOString(),
      reviewedAt: row.reviewedAt?.toISOString() ?? null,
      status: row.status,
      checks,
      mentorId: row.mentorId,
      mentorName: row.mentor?.name ?? null,
      mentorSlug: row.mentor?.slug ?? null,
      student: row.user,
    };
  }
}
