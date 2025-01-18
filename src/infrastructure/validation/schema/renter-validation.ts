import { z, ZodSchema } from 'zod';

export const RenterValidation: Record<string, ZodSchema<any>> = {
    login: z.object({
        email: z.string().email(),
        password: z.string().min(5),
    }),
};