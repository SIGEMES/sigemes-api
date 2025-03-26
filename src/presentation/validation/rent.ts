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

    public static filter = z.object({
        page: z.number().min(1).optional(),
        limit: z.number().min(1).optional(),
        search: z.string().optional(),
        type: z.enum(['guesthouse', 'city_hall']).optional(),
        status: z.enum(['pending', 'dikonfirmasi', 'selesai', 'dibatalkan']).optional(),
        checkin_checkout_status: z.enum(['belum_checkin', 'sudah_checkin', 'belum_checkout', 'sudah_checkout']).optional(),
        start_date: z.date().optional(),
        end_date: z.date().optional(),
    })
}