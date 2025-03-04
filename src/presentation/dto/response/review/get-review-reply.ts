import { ReviewReply } from "../../../../domain/entity/review-reply";

export class GetReviewReplyResponse {
    constructor(
        public id: number,
        public reviewId: number,
        public comment: string,
        public created_at: Date,
        public updated_at: Date,
    ) {}

    public static fromEntity(reviewReply: ReviewReply): GetReviewReplyResponse {
        return new GetReviewReplyResponse(
            reviewReply.id,
            reviewReply.reviewId,
            reviewReply.comment,
            reviewReply.createdAt,
            reviewReply.updatedAt,
        );
    }
}