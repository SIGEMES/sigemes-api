import { z } from 'zod';

export class PaymentValidation {
    public static id = z.object({
        id: z.number(),
    });
}