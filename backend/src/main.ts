import "reflect-metadata";
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { validationPipeOptions } from "./validation";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const origins = (process.env.CORS_ORIGIN ?? "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.enableCors({
    origin: origins,
    allowedHeaders: ["Content-Type", "Authorization", "X-Voter-Id"],
  });
  app.useGlobalPipes(new ValidationPipe(validationPipeOptions));

  await app.listen(Number(process.env.PORT) || 3001);
}

void bootstrap();
