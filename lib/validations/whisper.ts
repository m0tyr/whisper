import * as z from 'zod';

export const WhisperValidation = z.object({
  content: z.string().optional(),
  media: z.string().optional(),
  mentions: z.array(z.string()).optional(),
  accoundId: z.string(),
});
export const CommentValidation = z.object({
  content: z.string().optional(),
  media: z.string().optional(),
  accoundId: z.string(),
})