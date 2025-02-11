import { z } from 'zod';

export class GuesthouseValidation {
    public static id = z.object({
        id: z.number(),
    });

    public static createGuesthouse = z.object({
        name: z.string().min(3),
        description: z.string().min(10),
        facilities: z.string().min(3),
        area_m2: z.number().min(1),
        address: z.string().min(5),
        latitude: z.number(),
        longitude: z.number(),
        contact_person: z.string().min(10),
    });

    public static updateGuesthouse = z.object({
        name: z.string().min(3).optional(),
        description: z.string().min(10).optional(),
        facilities: z.string().min(3).optional(),
        area_m2: z.number().min(1).optional(),
        address: z.string().min(5).optional(),
        latitude: z.number().optional(),
        longitude: z.number().optional(),
        contact_person: z.string().min(10).optional(),
    });

    public static deletedMedia = z.array(z.object({
        id: z.number(),
        url: z.string(),
    }));
}