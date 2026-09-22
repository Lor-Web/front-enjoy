import { z } from "zod";
import { CONTACT_KEYS, GRADES } from "../model/types";
import { contactError } from "./contacts";

function optionalText(max: number, message: string) {
  return z.string().max(max, message);
}

export const profileFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Имя — минимум 2 символа")
    .max(80, "Имя — максимум 80 символов"),
  mentorBio: optionalText(500, "Описание — максимум 500 символов"),
  grade: z.union([z.literal(""), z.enum(GRADES)]),
  experience: optionalText(80, "Опыт работы — максимум 80 символов"),
  workplace: optionalText(120, "Место работы — максимум 120 символов"),
  country: optionalText(80, "Страна — максимум 80 символов"),
  city: optionalText(80, "Город — максимум 80 символов"),
  otherContacts: optionalText(300, "Другие контакты — максимум 300 символов"),
  contacts: z
    .object({
      telegram: z.string(),
      vk: z.string(),
      discord: z.string(),
      website: z.string(),
    })
    .superRefine((contacts, ctx) => {
      for (const key of CONTACT_KEYS) {
        const message = contactError(key, contacts[key]);
        if (message) {
          ctx.addIssue({ code: "custom", message, path: [key] });
        }
      }
    }),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
