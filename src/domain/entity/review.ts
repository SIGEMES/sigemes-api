import { Rent } from "./rent";
import { ReviewMedia } from "./review-media";
import { ReviewReply } from "./review-reply";

export class Review {
    constructor(
        public id: number = 0,
        public rentId: number = 0,
        public rating: number = 0,
        public comment: string = '',
        public createdAt: Date = new Date(),
        public updatedAt: Date = new Date(),

        public reviewMedia: ReviewMedia[] = [],
        public rent: Rent,
        public reviewReply: ReviewReply | null = null,
    ) {}
}