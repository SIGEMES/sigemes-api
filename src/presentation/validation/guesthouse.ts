import { z } from 'zod';

export class GuesthouseValidation {
    public static id = z.object({
        id: z.number(),
    });
}