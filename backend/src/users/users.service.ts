import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { mergeContacts, parseContacts } from "./contacts";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { toPublicProfile } from "./profile";

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

  async listMentors() {
    const users = await this.prisma.user.findMany({
      where: { mentorOffered: true },
      orderBy: { name: "asc" },
    });
    return Promise.all(users.map((user) => toPublicProfile(this.prisma, user)));
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

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        name: dto.name?.trim() ?? current.name,
        contacts,
        mentorOffered: dto.mentorOffered ?? current.mentorOffered,
        mentorBio:
          dto.mentorBio === undefined ? current.mentorBio : dto.mentorBio,
      },
    });

    return {
      ...(await toPublicProfile(this.prisma, user)),
      email: user.email,
    };
  }
}
