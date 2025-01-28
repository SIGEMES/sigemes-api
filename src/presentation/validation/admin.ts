import { z } from 'zod';

export class AdminValidation {
    public static login = z.object({
        email: z.string().email(),
        password: z.string().min(5),
    });

    public static createAdmin = z.object({
        email: z.string().email(),
        password: z.string().min(5),
        fullname: z.string().min(3),
        phone_number: z.string().min(10),
    });

    public static updateAdmin = z.object({
        id: z.number(),
        email: z.string().email(),
        password: z.string().min(5),
        fullname: z.string().min(3),
        phone_number: z.string().min(10),
    });

    public static updateAdminWithoutPassword = z.object({
        id: z.number(),
        email: z.string().email(),
        password: z.string().default(''),
        fullname: z.string().min(3),
        phone_number: z.string().min(10),
    });
}