import {
  Body,
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
import { ConnectGithubDto, safeNextPath } from "./dto/connect-github.dto";
import { GithubService } from "./github.service";

type LinkState = {
  sub: string;
  purpose: "github-link";
  next?: string;
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
  async connect(
    @CurrentUser() user: { id: string },
    @Body() dto: ConnectGithubDto,
  ) {
    if (!this.github.oauthConfigured()) {
      throw new ServiceUnavailableException(
        "Подключение GitHub пока не настроено",
      );
    }
    const next = safeNextPath(dto?.next) ?? undefined;
    const state = await this.jwt.signAsync(
      {
        sub: user.id,
        purpose: "github-link",
        ...(next ? { next } : {}),
      } satisfies LinkState,
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
    const next = await this.nextFromState(state);

    if (error === "access_denied") {
      this.redirectGithub(response, frontend, next, "denied");
      return;
    }
    if (!code || !state) {
      this.redirectGithub(response, frontend, next, "error");
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
        this.redirectGithub(response, frontend, payload.next, "taken");
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
      this.redirectGithub(response, frontend, payload.next, "linked");
    } catch {
      this.redirectGithub(response, frontend, next, "error");
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

  private async nextFromState(state: string | undefined) {
    if (!state) {
      return null;
    }
    try {
      const payload = await this.jwt.verifyAsync<LinkState>(state);
      return payload.purpose === "github-link" ? payload.next : null;
    } catch {
      return null;
    }
  }

  private redirectGithub(
    response: Response,
    frontend: string,
    next: string | undefined | null,
    status: string,
  ) {
    const path = safeNextPath(next ?? undefined) ?? "/me";
    const url = new URL(path, `${frontend.replace(/\/$/, "")}/`);
    url.searchParams.set("github", status);
    response.redirect(url.toString());
  }
}
