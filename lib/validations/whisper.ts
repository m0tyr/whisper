import * as z from 'zod';

export const WhisperValidation = z.object({
    whisper: z
        .string()
        .min(1, { message: "Enter data" })
    ,
    accoundId: z
        .string()
    ,
    media: z
        .string().url().array().optional(),
});