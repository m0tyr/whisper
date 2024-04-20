import * as z from 'zod';

export const LoginSchema = z.object({
    email: z.string().email(),
    password: z
    .string()
    .min(8, { message: "8 caractères minimum." })
  })