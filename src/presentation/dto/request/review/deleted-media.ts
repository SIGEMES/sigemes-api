import { ReviewMedia } from "../../../../domain/entity/review-media";

export class DeletedReviewMediaRequest {
    constructor(
        public id: number,
        public url: string,
    ) { }

    public static toEntity(data: DeletedReviewMediaRequest): ReviewMedia {
        return new ReviewMedia(
            data.id,
            0,
            data.url,
        );
    }
}