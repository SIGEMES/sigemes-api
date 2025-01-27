import { z } from 'zod';

export class AdminValidation {
    public static login = z.object({
        email: z.string().email(),
        password: z.string().min(5),
    });
}