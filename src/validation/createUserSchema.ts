import { z } from "zod";

export const createUserSchema = z.object({
    firstName: z.string().min(1, 'first name is required'),
    lastName: z.string().min(1, 'last name is required'),
    email: z.string().min(1, 'email is required').email('invalid email format'),
    mobileNumber: z.string()
      .min(1, 'mobile number is required')
      .min(7, 'mobile number must be at least 7 characters')
      .max(15, 'mobile number cannot be more than 15 characters'),
    password: z.string().min(1, 'password is required'),
    role: z.string().min(1, 'role is required'),
    isActive: z.string().min(1, 'status is required'),
});