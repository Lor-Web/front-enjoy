import {
  BadRequestException,
  type ValidationPipeOptions,
} from "@nestjs/common";
import type { ValidationError } from "class-validator";

function flatten(errors: ValidationError[]): string[] {
  const messages: string[] = [];
  for (const error of errors) {
    if (error.constraints) {
      for (const [key, value] of Object.entries(error.constraints)) {
        if (key === "whitelistValidation") {
          messages.push("Передано лишнее поле");
        } else {
          messages.push(value);
        }
      }
    }
    if (error.children?.length) {
      messages.push(...flatten(error.children));
    }
  }
  return messages;
}

export const validationPipeOptions: ValidationPipeOptions = {
  whitelist: true,
  transform: true,
  forbidNonWhitelisted: true,
  exceptionFactory: (errors: ValidationError[]) => {
    const messages = flatten(errors);
    return new BadRequestException(
      messages.join(". ") || "Проверьте введённые данные",
    );
  },
};
