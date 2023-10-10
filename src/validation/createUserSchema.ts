import { z } from "zod";

export const createUserSchema = z.object({
    firstName: z.string().min(1, 'First Name is required'),
    lastName: z.string().min(1, 'Last Name is required'),
    email: z.string().min(1, 'Email is required').email('Invalid email format'),
    mobileNumber: z.string()
      .min(1, 'Mobile Number is required')
      .min(7, 'Mobile Number must be at least 7 characters')
      .max(15, 'Mobile Number cannot be more than 15 characters'),
    password: z.string().min(1, 'Password is required'),
    userRole: z.string().min(1, 'Role is required'),
    isActive: z.string().min(1, 'Status is required'),
});