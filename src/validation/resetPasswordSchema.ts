import { z } from "zod";

export const resetPasswordSchema = z.object({
    email: z.string().min(1, 'email is required').email('invalid email format'),
    password: z.string().min(1, 'password is required'),
});