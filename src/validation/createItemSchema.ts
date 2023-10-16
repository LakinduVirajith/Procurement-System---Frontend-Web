import { z } from "zod";

export const createItemSchema = z.object({
    name: z.string().min(1, 'item name is required'),
    description: z.string(),
    manufacturer: z.string().min(1, 'manufacturer name is required'),
    price: z.string().min(1, 'price is required'),
    volumeType: z.string().min(1, 'volume type is required'),
    weight: z.string(),
    color: z.string(),
});