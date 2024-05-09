import * as z from 'zod';

export const UserValidation = z.object({
  profile_photo: z.string().url().optional(),
  name: z
    .string()
    .min(1, { message: "1 caractères minimum." })
    .max(30, { message: "30 caractères maximum." }),
  username: z
    .string()
    .min(2, { message: "2 caractères minimum." })
    .max(30, { message: "30 caractères maximum." })
    .refine(value => /^[a-zA-Z0-9_]+$/.test(value), {
      message: "Votre nom d'utilisateur ne peut contenir que des lettres, chiffres et '_'.",
    })
    .refine(value => !/\s/.test(value), {
      message: "Le nom d'utilisateur ne doit pas contenir d'espaces.",
    }),
  bio: z
    .string()
    .min(0, { message: "0 caractères minimum." })
    .max(30, { message: "30 caractères maximum." }),
});
export const ModificationValidation = z.object({
  profile_photo: z.string().url().nonempty(),
  name: z
    .string()
    .optional(),
  bio: z
    .string()
    .optional(),
  accoundId: z.string(),
})