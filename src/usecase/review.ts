import { Review } from "../domain/entity/review";
import { ResponseError } from "../domain/error/response-error";
import { ReviewRepositoryInterface } from "../domain/interface/repository/review";

export class ReviewUsecase {
    constructor(
        private reviewRepository: ReviewRepositoryInterface
    ) {}

    public async getReviewsByCityHallId(cityHallId: number): Promise<Review[]> {
        const reviews: Review[] = await this.reviewRepository.getReviewsByCityHallId(cityHallId);

        return reviews;
    }

    public async getReviewsByGuesthouseRoomId(guesthouseRoomId: number): Promise<Review[]> {
        const reviews: Review[] = await this.reviewRepository.getReviewsByGuesthouseRoomId(guesthouseRoomId);

        return reviews;
    }
}