import { z } from 'zod';

export class GuesthouseRoomValidation {
    public static id = z.object({
        id: z.number(),
    });

    public static createGuesthouseRoom = z.object({
        name: z.string(),
        type: z.enum(["vip", "standard"]),
        facilities: z.string(),
        available_slot: z.number().min(0),
        total_slot: z.number().min(1),
        area_m2: z.number(),
        status: z.enum(["tersedia", "tidak_tersedia"]),
        room_pricing: z.array(z.object({
            id: z.number().default(0),
            retribution_type: z.string(),
            price_per_day: z.number().min(1),
            is_available: z.boolean().default(true),
        })),
    });

    public static updateGuesthouseRoom = z.object({
        name: z.string().optional(),
        type: z.enum(["vip", "standard"]).optional(),
        facilities: z.string().optional(),
        available_slot: z.number().min(0).optional(),
        total_slot: z.number().min(1).optional(),
        area_m2: z.number().optional(),
        status: z.enum(["tersedia", "tidak_tersedia"]).optional(),
        room_pricing: z.array(z.object({
            id: z.number(),
            retribution_type: z.string(),
            price_per_day: z.number().min(1),
            is_available: z.boolean().default(true),
        })),
    });

    public static deletedMedia = z.array(z.object({
        id: z.number(),
        url: z.string(),
    }));
}