import { Review } from "../../entity/review";
import { ReviewMedia } from "../../entity/review-media";
import { ReviewReply } from "../../entity/review-reply";

export interface ReviewRepositoryInterface {
    getReviewsByCityHallId(cityHallId: number): Promise<Review[]>;
    getReviewsByGuesthouseRoomId(guesthouseRoomId: number): Promise<Review[]>;
    getReviewById(id: number): Promise<Review>;
    getReviewByRentId(rentId: number): Promise<Review>;
    getReviewReplyByReviewId(reviewId: number): Promise<ReviewReply>;
    getReviewReplyById(id: number): Promise<ReviewReply>;
    createReview(review: Review): Promise<Review>;
    updateReviewOnly(review: Review, transaction?: any): Promise<Review>;
    createReviewMedia(reviewMedia: ReviewMedia[], transaction?: any): Promise<ReviewMedia[]>;
    createReviewReply(reviewReply: ReviewReply): Promise<ReviewReply>;
    updateReviewReply(reviewReply: ReviewReply): Promise<ReviewReply>;
    deleteReviewReplyById(reviewReply: number): Promise<boolean>;
    deleteReviewMediaByIds(ids: number[], transaction?: any): Promise<boolean>;
}