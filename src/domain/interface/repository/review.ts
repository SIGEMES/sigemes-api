import { Review } from "../../entity/review";
import { ReviewReply } from "../../entity/review-reply";

export interface ReviewRepositoryInterface {
    getReviewsByCityHallId(cityHallId: number): Promise<Review[]>;
    getReviewsByGuesthouseRoomId(guesthouseRoomId: number): Promise<Review[]>;
}