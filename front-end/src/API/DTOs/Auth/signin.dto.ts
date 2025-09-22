import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email().min(1, "Email is required").transform(val => val.toLowerCase().trim()),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export type SignInDto = z.infer<typeof signInSchema>;
