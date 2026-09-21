import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { mergeContacts, parseContacts } from "./contacts";
import { emptyToNull, isGrade } from "./details";
import { ListUsersQueryDto } from "./dto/list-users-query.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { toMeProfile, toPublicProfile } from "./profile";
import { mergeVisibility, parseVisibility } from "./visibility";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getBySlug(slug: string) {
    const user = await this.prisma.user.findUnique({ where: { slug } });
    if (!user) {
      throw new NotFoundException("Пользователь не найден");
    }
    return toPublicProfile(this.prisma, user);
  }

  async list(query: ListUsersQueryDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 12;
    const q = query.q?.trim() ?? "";
    const where = {
      ...(query.mentors ? { mentorOffered: true } : {}),
      ...(query.grade ? { grade: query.grade } : {}),
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" as const } },
              { city: { contains: q, mode: "insensitive" as const } },
              { country: { contains: q, mode: "insensitive" as const } },
            ],
          }
        : {}),
    };
    const total = await this.prisma.user.count({ where });
    const pages = Math.max(1, Math.ceil(total / limit) || 1);
    const safePage = Math.min(page, pages);
    const users = await this.prisma.user.findMany({
      where,
      orderBy: { name: "asc" },
      skip: (safePage - 1) * limit,
      take: limit,
    });
    return {
      items: await Promise.all(
        users.map((user) => toPublicProfile(this.prisma, user)),
      ),
      total,
      page: safePage,
      limit,
      pages,
    };
  }

  async updateMe(userId: string, dto: UpdateProfileDto) {
    const current = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
    });

    let contacts = parseContacts(current.contacts);
    try {
      contacts = mergeContacts(contacts, dto.contacts);
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : "Проверьте контакты",
      );
    }

    const grade =
      dto.grade === undefined
        ? current.grade
        : dto.grade === null
          ? null
          : isGrade(dto.grade)
            ? dto.grade
            : current.grade;

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        name: dto.name?.trim() ?? current.name,
        contacts,
        mentorOffered: dto.mentorOffered ?? current.mentorOffered,
        mentorBio:
          dto.mentorBio === undefined ? current.mentorBio : dto.mentorBio,
        grade,
        experience:
          dto.experience === undefined
            ? current.experience
            : emptyToNull(dto.experience),
        workplace:
          dto.workplace === undefined
            ? current.workplace
            : emptyToNull(dto.workplace),
        country:
          dto.country === undefined
            ? current.country
            : emptyToNull(dto.country),
        city: dto.city === undefined ? current.city : emptyToNull(dto.city),
        otherContacts:
          dto.otherContacts === undefined
            ? current.otherContacts
            : emptyToNull(dto.otherContacts),
        visibility: mergeVisibility(
          parseVisibility(current.visibility),
          dto.visibility,
        ),
      },
    });

    return toMeProfile(this.prisma, user);
  }
}
