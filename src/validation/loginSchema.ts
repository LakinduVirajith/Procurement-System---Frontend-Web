import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "email is required").email("invalid email address"),
  password: z.string().min(1, "password is required"),
});