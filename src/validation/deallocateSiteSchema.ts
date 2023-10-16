import { z } from "zod";

export const deallocateSiteSchema = z.object({
    siteId: z.string().min(1, 'site id is required'),
    userEmail: z.string().min(1, 'user email is required').email('invalid user email'),
});