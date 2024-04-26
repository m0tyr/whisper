import * as z from 'zod';

export const WhisperValidation = z.object({
  content: z.array(z.object({
    text: z.string(),
    type: z.string(),
  })).optional(),
  media: z.array(z.object({
    s3url: z.string().optional(),
    aspectRatio: z.string(),
    width: z.string(),
    height: z.string(),
    isVideo: z.boolean(),
  })).optional(),
  mentions: z.array(z.string()).optional(),
  accoundId: z.string(),
});

export const CommentValidation = z.object({
  content: z.array(z.object({
    text: z.string(),
    type: z.string(),
  })).optional(),
  media: z.array(z.object({
    s3url: z.string().optional(),
    aspectRatio: z.string(),
    width: z.string(),
    isVideo: z.boolean(),
  })).optional(),
  mentions: z.array(z.string()).optional(),
  accoundId: z.string(),
})
export const SearchValidation = z.object({
  username: z.string().optional(),
});