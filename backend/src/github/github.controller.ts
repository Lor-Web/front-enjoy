import {
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Res,
  ServiceUnavailableException,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import type { Response } from "express";
import { CurrentUser } from "../auth/current-user.decorator";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { PrismaService } from "../prisma/prisma.service";
import { toMeProfile } from "../users/profile";
import { GithubService } from "./github.service";

type LinkState = {
  sub: string;
  purpose: "github-link";
};

@Controller("auth/github")
export class GithubController {
  constructor(
    private readonly github: GithubService,
    private readonly jwt: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  @Post("connect")
  @UseGuards(JwtAuthGuard)
  async connect(@CurrentUser() user: { id: string }) {
    if (!this.github.oauthConfigured()) {
      throw new ServiceUnavailableException(
        "Подключение GitHub пока не настроено",
      );
    }
    const state = await this.jwt.signAsync(
      { sub: user.id, purpose: "github-link" } satisfies LinkState,
      { expiresIn: "10m" },
    );
    return { url: this.github.authorizeUrl(state) };
  }

  @Get("callback")
  async callback(
    @Query("code") code: string | undefined,
    @Query("state") state: string | undefined,
    @Query("error") error: string | undefined,
    @Res() response: Response,
  ) {
    const frontend = this.github.frontendUrl();
    if (error === "access_denied") {
      response.redirect(`${frontend}/me?github=denied`);
      return;
    }
    if (!code || !state) {
      response.redirect(`${frontend}/me?github=error`);
      return;
    }

    try {
      const payload = await this.jwt.verifyAsync<LinkState>(state);
      if (payload.purpose !== "github-link") {
        throw new UnauthorizedException();
      }
      const githubUser = await this.github.userFromCode(code);
      const githubId = String(githubUser.id);
      const taken = await this.prisma.user.findFirst({
        where: { githubId, NOT: { id: payload.sub } },
      });
      if (taken) {
        response.redirect(`${frontend}/me?github=taken`);
        return;
      }

      await this.prisma.user.update({
        where: { id: payload.sub },
        data: {
          githubId,
          githubLogin: githubUser.login,
          githubLinkedAt: new Date(),
        },
      });
      response.redirect(`${frontend}/me?github=linked`);
    } catch {
      response.redirect(`${frontend}/me?github=error`);
    }
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  async disconnect(@CurrentUser() user: { id: string }) {
    const updated = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        githubId: null,
        githubLogin: null,
        githubLinkedAt: null,
      },
    });
    return await toMeProfile(this.prisma, updated);
  }
}
