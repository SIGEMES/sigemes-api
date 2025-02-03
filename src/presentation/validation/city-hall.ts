import { z } from 'zod';

export class CityHallValidation {
    public static id = z.object({
        id: z.number(),
    });

}