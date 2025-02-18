import { z } from 'zod';

export class CityHallValidation {
    public static id = z.object({
        id: z.number(),
    });

    public static createCityHall = z.object({
        name: z.string().min(3),
        description: z.string(),
        area_m2: z.number().min(1),
        people_capacity: z.number().min(1),
        address: z.string().min(5),
        latitude: z.number(),
        longitude: z.number(),
        status: z.enum(['tersedia', 'tidak_tersedia']),
        contact_person: z.string().min(10),
        pricing: z.array(z.object({
            id: z.number().default(0),
            activity_type: z.string(),
            facilities: z.string(),
            price_per_day: z.number().min(1),
            is_active: z.boolean().default(true),
        })),
    });

    public static updateCityHall = z.object({
        name: z.string().min(3),
        description: z.string(),
        area_m2: z.number().min(1),
        people_capacity: z.number().min(1),
        address: z.string().min(5),
        latitude: z.number(),
        longitude: z.number(),
        status: z.enum(['tersedia', 'tidak_tersedia']),
        contact_person: z.string().min(10),
        pricing: z.array(z.object({
            id: z.number().min(0),
            activity_type: z.string(),
            facilities: z.string(),
            price_per_day: z.number().min(1),
            is_active: z.boolean(),
        })),
    });

    public static deletedMedia = z.array(z.object({
        id: z.number(),
        url: z.string(),
    }));
}