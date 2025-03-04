import { Review } from "../domain/entity/review";
import { ReviewMedia } from "../domain/entity/review-media";
import { ResponseError } from "../domain/error/response-error";
import { ObjectStorageInterface } from "../domain/interface/external-service/object-storage";
import { File } from "../domain/interface/library/file";
import { DbTransactionInterface } from "../domain/interface/repository/db-transaction";
import { ReviewRepositoryInterface } from "../domain/interface/repository/review";

export class ReviewUsecase {
    constructor(
        private reviewRepository: ReviewRepositoryInterface,
        private dbTransaction: DbTransactionInterface,
        private objectStorageService: ObjectStorageInterface,
    ) { }

    public async getReviewsByCityHallId(cityHallId: number): Promise<Review[]> {
        const reviews: Review[] = await this.reviewRepository.getReviewsByCityHallId(cityHallId);

        return reviews;
    }

    public async getReviewsByGuesthouseRoomId(guesthouseRoomId: number): Promise<Review[]> {
        const reviews: Review[] = await this.reviewRepository.getReviewsByGuesthouseRoomId(guesthouseRoomId);

        return reviews;
    }

    public async getReviewByRentId(rentId: number): Promise<Review> {
        const review: Review = await this.reviewRepository.getReviewByRentId(rentId);
        if (!review) {
            throw new ResponseError("Review not found", 404);
        }

        return review;
    }

    public async createReview(review: Review, media: File[]): Promise<Review> {
        const existingReview: Review | null = await this.reviewRepository.getReviewByRentId(review.rentId);
        if (existingReview) {
            throw new ResponseError("Review already exists", 400);
        }
        
        if (media.length > 0) {
            if (media.length > 5) {
                throw new ResponseError("Maximum media upload is 5 files", 400);
            }

            media = media.map(file => ({
                ...file,
                originalName: `${Date.now()}-${Math.random().toString(36).substring(7)}-${file.originalName}`,
            }));

            const mediaURL: string[] = await this.objectStorageService.uploadMultipleFiles(media, "review-media");

            review.reviewMedia = mediaURL.map((url, index) => ({
                id: index,
                reviewId: review.id,
                url,
            }));
        }

        const createdReview: Review = await this.reviewRepository.createReview(review);

        return createdReview;
    }

    public async updateReview(renterId: number, review: Review, newMediaFile: File[], deletedObjectMedia: ReviewMedia[]): Promise<Review> {
        return await this.dbTransaction.run(async (tx) => {
            const oldReview: Review | null = await this.reviewRepository.getReviewById(review.id);
            if (!oldReview) {
                throw new ResponseError("Review not found", 404);
            }

            if(!oldReview.rent) {
                throw new ResponseError("Rent not found", 404);
            }

            if(!oldReview.rent.renter) {
                throw new ResponseError("Renter not found", 404);
            }

            if (oldReview.rent.renter.id !== renterId) {
                throw new ResponseError("You are not authorized to update this review", 403);
            }

            let updatedReview: Review = oldReview;
            
            if (review.rating !== oldReview.rating || review.comment !== oldReview.comment) {
                updatedReview = await this.reviewRepository.updateReviewOnly(review, tx);
            }

            if (newMediaFile.length + oldReview.reviewMedia.length - deletedObjectMedia.length > 5) {
                throw new ResponseError("Maximum media is 5 files", 400);
            }

            let newMedia: ReviewMedia[] = [];
            if (newMediaFile.length > 0) {
                newMediaFile = newMediaFile.map(file => ({
                    ...file,
                    originalName: `${Date.now()}-${Math.random().toString(36).substring(7)}-${file.originalName}`,
                }));

                const mediaURL: string[] = await this.objectStorageService.uploadMultipleFiles(newMediaFile, "review-media");

                newMedia = mediaURL.map((url, index) => ({
                    id: index,
                    reviewId: review.id,
                    url,
                }));

                newMedia = await this.reviewRepository.createReviewMedia(newMedia, tx);
            }

            let deletedRoomIds: number[] = [];
            if (deletedObjectMedia.length > 0) {
                for (const media of deletedObjectMedia) {
                    const mediaName: string = media.url.split("/").pop() as string;
                    const mediaPath: string = `review-media/${mediaName}`;
                    await this.objectStorageService.deleteFile(mediaPath);
                    deletedRoomIds.push(media.id);
                }
                
                await this.reviewRepository.deleteReviewMediaByIds(deletedRoomIds, tx);
            }

            let finalReviewMedia: ReviewMedia[] = [];
            for (const media of oldReview.reviewMedia) {
                if (deletedRoomIds.includes(media.id)) {
                    continue;
                }

                finalReviewMedia.push(media);
            }

            finalReviewMedia = finalReviewMedia.concat(newMedia);
            updatedReview.reviewMedia = finalReviewMedia;

            return updatedReview;
        });
    }
}