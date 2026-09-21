import { z } from "zod";

const emailField = z
  .string()
  .trim()
  .superRefine((value, ctx) => {
    if (!value) {
      ctx.addIssue({ code: "custom", message: "Укажите email" });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      ctx.addIssue({ code: "custom", message: "Укажите корректный email" });
    }
  });

const passwordField = z.string().superRefine((value, ctx) => {
  if (!value) {
    ctx.addIssue({ code: "custom", message: "Укажите пароль" });
    return;
  }
  if (value.length < 8) {
    ctx.addIssue({ code: "custom", message: "Пароль — минимум 8 символов" });
  }
});

export const loginSchema = z.object({
  email: emailField,
  password: passwordField,
});

export type LoginValues = z.infer<typeof loginSchema>;

export const signupSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Имя — минимум 2 символа")
      .max(80, "Имя — максимум 80 символов"),
    email: emailField,
    password: passwordField,
    passwordConfirm: z.string().min(1, "Повторите пароль"),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Пароли не совпадают",
    path: ["passwordConfirm"],
  });

export type SignupValues = z.infer<typeof signupSchema>;
