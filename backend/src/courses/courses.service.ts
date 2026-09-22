import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { MentorshipStatus } from "@prisma/client";
import { GithubService } from "../github/github.service";
import { PrismaService } from "../prisma/prisma.service";
import { normalizeHomeworkPullUrl } from "./pull-url";
import { homeworkRepoName } from "./templates";

@Injectable()
export class CoursesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly github: GithubService,
  ) {}

  async getRepository(userId: string, courseSlug: string) {
    this.requireTemplate(courseSlug);
    const repo = await this.prisma.courseRepository.findUnique({
      where: { userId_courseSlug: { userId, courseSlug } },
    });
    if (!repo) {
      return null;
    }
    return this.serialize(repo);
  }

  async createRepository(userId: string, courseSlug: string) {
    const templateRepo = this.requireTemplate(courseSlug);
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
    });
    if (!user.githubLogin) {
      throw new ConflictException("Сначала подключите GitHub в профиле");
    }

    const existing = await this.prisma.courseRepository.findUnique({
      where: { userId_courseSlug: { userId, courseSlug } },
    });
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
      include: { mentor: { select: { id: true, name: true } } },
    });
    if (!row) {
      return null;
    }
    return this.serializeHomework(row);
  }

  async submitHomework(
    userId: string,
    courseSlug: string,
    moduleSlug: string,
    prUrl: string,
    mentorId: string,
  ) {
    this.requireTemplate(courseSlug);
    this.requireModuleSlug(moduleSlug);
    const repo = await this.prisma.courseRepository.findUnique({
      where: { userId_courseSlug: { userId, courseSlug } },
    });
    if (!repo) {
      throw new ConflictException("Сначала создайте репозиторий курса");
    }

    const mentorship = await this.prisma.mentorship.findFirst({
      where: {
        studentId: userId,
        mentorId,
        status: MentorshipStatus.active,
      },
    });
    if (!mentorship) {
      throw new ConflictException(
        "Сдать работу можно только активному ментору",
      );
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
        mentorId,
      },
      update: {
        prUrl: normalized,
        mentorId,
        submittedAt: new Date(),
      },
      include: { mentor: { select: { id: true, name: true } } },
    });
    return this.serializeHomework(row);
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

  private serializeHomework(row: {
    courseSlug: string;
    moduleSlug: string;
    prUrl: string;
    submittedAt: Date;
    mentorId: string | null;
    mentor: { id: string; name: string } | null;
  }) {
    return {
      courseSlug: row.courseSlug,
      moduleSlug: row.moduleSlug,
      prUrl: row.prUrl,
      submittedAt: row.submittedAt.toISOString(),
      mentorId: row.mentorId,
      mentorName: row.mentor?.name ?? null,
    };
  }
}
