import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { GithubService } from "../github/github.service";
import { PrismaService } from "../prisma/prisma.service";
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
      throw new NotFoundException("Репозиторий курса ещё не создан");
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
    const created = await this.github.createFromTemplate({
      templateRepo,
      name,
      description: `Домашние задания курса ${courseSlug}`,
    });
    await this.github.inviteCollaborator({
      owner: created.owner.login,
      repo: created.name,
      username: user.githubLogin,
    });

    const repo = await this.prisma.courseRepository.create({
      data: {
        userId,
        courseSlug,
        owner: created.owner.login,
        name: created.name,
        htmlUrl: created.html_url,
      },
    });
    return this.serialize(repo);
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
}
