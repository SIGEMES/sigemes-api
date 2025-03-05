import { url } from 'inspector';
import { z } from 'zod';

export class ReviewValidation {
    public static id = z.object({
        id: z.number().min(1),
    });

    public static createReview = z.object({
        rating: z.number().min(1).max(5),
        comment: z.string(),
    });

    public static createReviewReply = z.object({
        comment: z.string(),
    });
    
    public static updateReview = z.object({
        rating: z.number().min(1).max(5),
        comment: z.string(),
    });

    public static deletedMedia = z.object({
        deleted_media_object: z.array(z.object({
            id: z.number(),
            url: z.string(),
        })),
    });
}