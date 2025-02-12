import { z } from 'zod';

export class GuesthouseRoomValidation {
    public static id = z.object({
        id: z.number(),
    });
}