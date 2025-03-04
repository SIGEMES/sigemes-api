import { Review } from "../../../../domain/entity/review";
import { ReviewReply } from "../../../../domain/entity/review-reply";
import { GetRentResponse } from "./get-rent";

export class GetReviewResponse {
    constructor(
        public id: number,
        public rentId: number,
        public rating: number,
        public comment: string,
        public created_at: Date,
        public updated_at: Date,
        public rent: GetRentResponse,
        public reviewReply: ReviewReply | null,
    ) {}

    public static fromEntity(review: Review): GetReviewResponse {
        return new GetReviewResponse(
            review.id,
            review.rentId,
            review.rating,
            review.comment,
            review.createdAt,
            review.updatedAt,
            GetRentResponse.fromEntity(review.rent),
            review.reviewReply,
        );
    }
}