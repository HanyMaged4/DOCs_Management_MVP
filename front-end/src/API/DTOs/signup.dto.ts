import { z } from "zod";

export const signUpSchema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().email().min(1, "Email is required").transform(val => val.toLowerCase().trim()),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  sec_password: z.string().optional(),
});

export type SignUpDto = z.infer<typeof signUpSchema>;
