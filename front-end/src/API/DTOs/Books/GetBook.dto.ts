import { z } from "zod";

export const GetBookDto = z.object({
    book_id: z.number,
    title: z.string()
        .min(1, { message: "Title is required" })
        .max(100, { message: "Title must be between 1 and 100 characters" })
        .regex(/^[a-zA-Z0-9\s\-_.,!?()]+$/, { message: "Title contains invalid characters" })
        .transform(value => value.trim()),
        
    description: z.string()
        .max(1000, { message: "Description cannot exceed 1000 characters" })
        .transform(value => value.trim())
        .optional(),
        
    sec_password: z.string()
        .min(6, { message: "Security password must be at least 6 characters" })
        .max(50, { message: "Security password cannot exceed 50 characters" })
        .transform(value => value.trim())
        .optional(),
});

export type GetBookDto = z.infer<typeof GetBookDto>;