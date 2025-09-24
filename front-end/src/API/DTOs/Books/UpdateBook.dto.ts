import { z } from "zod";

export const updateBookSchema = z.object({
    book_id: z.number().min(1).optional(),
    title: z
        .string()
        .trim()
        .min(1, { message: "Title must be between 1 and 100 characters" })
        .max(100, { message: "Title must be between 1 and 100 characters" })
        .regex(/^[a-zA-Z0-9\s\-_.,!?()]+$/, { message: "Title contains invalid characters" })
        .optional(),
        
    description: z
        .string()
        .trim()
        .max(1000, { message: "Description cannot exceed 1000 characters" })
        .optional(),
        
    sec_password: z
        .string()
        .trim()
        .min(6, { message: "Security password must be at least 6 characters" })
        .max(50, { message: "Security password cannot exceed 50 characters" })
        .optional(),
});

export type UpdateBookDto = z.infer<typeof updateBookSchema>;