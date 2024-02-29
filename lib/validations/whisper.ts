import * as z from 'zod';

export const WhisperValidation = z.object({
      content: z.string(),
      media: z.string().url(),
      accoundId: z.string(),
  });