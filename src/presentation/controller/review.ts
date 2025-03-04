import { Request, Response, NextFunction } from 'express';
import { Review } from '../../domain/entity/review';
import { ReviewUsecase } from '../../usecase/review';
import { BaseSuccessResponse } from '../dto/response/base/base-success';
import { GetReviewResponse } from '../dto/response/review/get-review';

export class ReviewController {
    constructor(private reviewUsecase: ReviewUsecase) { }

    public async getReviewsByCityHallId(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const reviews: Review[] = await this.reviewUsecase.getReviewsByCityHallId(Number(req.params.id));
            const reviewsResponse: GetReviewResponse[] = reviews.map(review => GetReviewResponse.fromEntity(review));
            res.status(200).json(new BaseSuccessResponse(true, "Get all city hall reviews success", reviewsResponse));  
        } catch (error) {
            next(error);
        }
    }

    public async getReviewsByGuesthouseRoomId(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const reviews: Review[] = await this.reviewUsecase.getReviewsByGuesthouseRoomId(Number(req.params.room_id));
            const reviewsResponse: GetReviewResponse[] = reviews.map(review => GetReviewResponse.fromEntity(review));
            res.status(200).json(new BaseSuccessResponse(true, "Get all guesthouse room reviews success", reviewsResponse));  
        } catch (error) {
            next(error);
        }
    }
}