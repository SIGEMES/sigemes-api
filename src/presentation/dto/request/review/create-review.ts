import { Review } from "../../../../domain/entity/review";

export class CreateReviewRequest {
    constructor(
        public rating: number,
        public comment: string,
    ) { }

    public static toEntity(data: CreateReviewRequest): Review {
        return new Review(
            0,
            0,
            data.rating,
            data.comment,
            new Date(),
            new Date(),
            [],
            null,
            null,
        );
    }
}