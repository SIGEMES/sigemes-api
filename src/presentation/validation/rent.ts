import { z } from 'zod';

export class RentValidation {
    public static id = z.object({
        id: z.number(),
    });

    public static create = z.object({
        guesthouse_room_pricing_id: z.number().nullable(),
        city_hall_pricing_id: z.number().nullable(),
        slot: z.number().min(1),
        start_date: z.date(),
        end_date: z.date(),
        renter_gender: z.enum(['laki_laki', 'perempuan']),
    });
}