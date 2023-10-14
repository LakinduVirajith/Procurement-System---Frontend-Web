import { z } from "zod";

export const createSiteSchema = z.object({
    siteName: z.string().min(1, 'site name is required'),
    location: z.string().min(1, 'location is required'),
    startDate: z.string(),
    contactNumber: z.string()
      .min(1, 'contact number is required')
      .min(7, 'contact number must be at least 7 characters')
      .max(15, 'contact number cannot be more than 15 characters'),
    allocatedBudget: z.number(),
    siteManagerId: z.string(),
    procurementManagerId: z.string(),
});