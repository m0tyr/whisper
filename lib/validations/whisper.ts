import * as z from 'zod';

export const WhisperValidation = z.object({
    whisper: z.object({
      content: z.string().min(0, {
        message: "",
      }),
    }),
  });