import { z } from 'zod';

export const updateEntitySchema = z.object({
  book_id: z.number().optional(),

  title: z.string()
  .min(1, { message: 'Title must be between 1 and 50 characters' })
  .max(50, { message: 'Title must be between 1 and 50 characters' })
  .optional(),

  content: z.string()
    .max(5000, { message: 'Content must be at most 5000 characters' })
    .optional(),

  tags: z.array(
    z.number()
  ).optional(),

  attachments: z.any().optional(),
});

export type UpdateEntityInput = z.infer<typeof updateEntitySchema>;