import { z, ZodType } from 'zod';

export class RenterValidation {
    static readonly login: ZodType = z.object({
        email: z.string().email(),
        password: z.string().min(5),
    });
}