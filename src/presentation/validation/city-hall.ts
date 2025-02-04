import { z } from 'zod';

export class CityHallValidation {
    public static id = z.object({
        id: z.number(),
    });

    public static createCityHall = z.object({
        name: z.string().min(3),
        description: z.string().min(10),
        area_m2: z.number().min(1),
        people_capacity: z.number().min(1),
        address: z.string().min(5),
        latitude: z.number(),
        longitude: z.number(),
        status: z.enum(['tersedia', 'tidak_tersedia']),
        contact_person: z.string().min(10),
        pricing: z.array(z.object({
            activity_type: z.string().min(3),
            facilities: z.string().min(3),
            price_per_day: z.number().min(1),
        })),
    });
}