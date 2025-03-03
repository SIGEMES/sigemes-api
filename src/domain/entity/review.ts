import { ReviewMedia } from "./review-media";
import { ReviewReply } from "./review-reply";

export class Review {
    constructor(
        public id: number = 0,
        public userId: number = 0,
        public content: string = '',
        public rating: number = 0,
        public createdAt: Date = new Date(),
        public updatedAt: Date = new Date(),

        public reviewMedia: ReviewMedia[] = [],
        public reviewReply: ReviewReply | null = null,
    ) {}
}