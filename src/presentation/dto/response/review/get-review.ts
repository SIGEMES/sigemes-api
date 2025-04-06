import { Review } from "../../../../domain/entity/review";
import { ReviewReply } from "../../../../domain/entity/review-reply";
import { GetRentResponse } from "./get-rent";
import { GetReviewMediaResponse } from "./get-review-media";
import { GetReviewReplyResponse } from "./get-review-reply";

export class GetReviewResponse {
    constructor(
        public id: number,
        public rentId: number,
        public rating: number,
        public comment: string,
        public created_at: Date,
        public updated_at: Date,
        public review_media: GetReviewMediaResponse[],
        public rent: GetRentResponse | null,
        public review_reply: GetReviewReplyResponse | null,
    ) {}

    public static fromEntity(review: Review): GetReviewResponse {
        return new GetReviewResponse(
            review.id,
            review.rentId,
            review.rating,
            review.comment,
            review.createdAt,
            review.updatedAt,
            review.reviewMedia.map(media => GetReviewMediaResponse.fromEntity(media)),
            GetRentResponse.fromEntity(review.rent),
            review.reviewReply ? GetReviewReplyResponse.fromEntity(review.reviewReply) : null,
        );
    }
}