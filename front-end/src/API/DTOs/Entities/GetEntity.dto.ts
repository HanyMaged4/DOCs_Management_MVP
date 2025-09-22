import { z } from 'zod';

export const getEntitySchema = z.object({
  entity_id: z.number(),
  book_id: z.preprocess((val) => {
    if (val === null || val === undefined || val === '') return undefined;
    const num = Number(val);
    return isNaN(num) ? val : num;
  }, z.number()),

  title: z.preprocess((val) => {
    if (val === null || val === undefined) return undefined;
    return typeof val === 'string' ? val.trim() : String(val);
  }, z.string()
  .min(1, { message: 'Title must be between 1 and 50 characters' })
  .max(50, { message: 'Title must be between 1 and 50 characters' })),

  content: z.preprocess((val) => {
    if (val === null || val === undefined || val === '') return undefined;
    return typeof val === 'string' ? val.trim() : String(val);
  }, z.string()
    .max(5000, { message: 'Content must be at most 5000 characters' })
  ).optional(),

  tags: z.preprocess((val) => {
    if (!val || val === '' || val === 'undefined') return undefined;
    if (Array.isArray(val)) {
      return val.map((id) => Number(id)).filter((n) => !isNaN(n));
    }
    if (typeof val === 'string') {
      return val.split(',')
        .map((s) => Number(s.trim()))
        .filter((n) => !isNaN(n));
    }
    return undefined;
  }, z.array(z.number()).optional()).optional(),

  attachments: z.any().optional(),
});

export type GetEntityInput = z.infer<typeof getEntitySchema>;