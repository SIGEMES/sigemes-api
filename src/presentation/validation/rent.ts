import { z } from 'zod';

export class RentValidation {
    public static id = z.object({
        id: z.number(),
    });
}