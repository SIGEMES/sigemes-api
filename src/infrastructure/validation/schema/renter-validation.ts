import { z, ZodSchema } from 'zod';

export const RenterValidation: Record<string, ZodSchema<any>> = {
    login: z.object({
        email: z.string().email(),
        password: z.string().min(5),
    }),
    register: z.object({
        email: z.string().email(),
        password: z.string().min(5),
        fullname: z.string().min(3),
        gender: z.string().max(5),
    }),
};