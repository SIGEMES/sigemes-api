import { ReviewMedia } from "../../../../domain/entity/review-media";

export class GetReviewMediaResponse {
    constructor(
        public id: number,
        public url: string,
    ) {}

    public static fromEntity(reviewMedia: ReviewMedia): GetReviewMediaResponse {
        return new GetReviewMediaResponse(
            reviewMedia.id,
            reviewMedia.url,
        );
    }
}