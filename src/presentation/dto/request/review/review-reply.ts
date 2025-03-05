import { ReviewReply } from "../../../../domain/entity/review-reply";

export class ReviewReplyRequest {
    constructor (
        public comment: string,
    ) {}

    public static toEntity(data: ReviewReplyRequest): ReviewReply {
        return new ReviewReply(
            0,
            0,
            0,
            data.comment,
        );
    }
}