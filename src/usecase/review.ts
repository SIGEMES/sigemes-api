import { Rent } from "../domain/entity/rent";
import { Review } from "../domain/entity/review";
import { ReviewMedia } from "../domain/entity/review-media";
import { ReviewReply } from "../domain/entity/review-reply";
import { ResponseError } from "../domain/error/response-error";
import { ObjectStorageInterface } from "../domain/interface/external-service/object-storage";
import { File } from "../domain/interface/library/file";
import { DbTransactionInterface } from "../domain/interface/repository/db-transaction";
import { RentRepositoryInterface } from "../domain/interface/repository/rent";
import { ReviewRepositoryInterface } from "../domain/interface/repository/review";

export class ReviewUsecase {
    constructor(
        private reviewRepository: ReviewRepositoryInterface,
        private rentRepository: RentRepositoryInterface,
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

    public async createReview(review: Review, media: File[], renterId: number): Promise<Review> {
        const rentWithReview: Rent | null = await this.rentRepository.getRentByIdWithReview(review.rentId);
        if (!rentWithReview) {
            throw new ResponseError("Rent not found", 404);
        }

        if (rentWithReview.status !== "selesai") {
            throw new ResponseError("Rent is not finished yet", 400);
        }

        if (rentWithReview.review) {
            throw new ResponseError("Review already exists", 400);
        }

        if (rentWithReview.renterId !== renterId) {
            throw new ResponseError("You do not have permission to access this resource", 403);
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
                throw new ResponseError("You do not have permission to access this resource", 403);
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

            let deletedMediaIds: number[] = [];
            if (deletedObjectMedia.length > 0) {
                for (const media of deletedObjectMedia) {
                    const mediaName: string = media.url.split("/").pop() as string;
                    const mediaPath: string = `review-media/${mediaName}`;
                    await this.objectStorageService.deleteFile(mediaPath);
                    deletedMediaIds.push(media.id);
                }
                
                await this.reviewRepository.deleteReviewMediaByIds(deletedMediaIds, tx);
            }

            let finalReviewMedia: ReviewMedia[] = [];
            for (const media of oldReview.reviewMedia) {
                if (deletedMediaIds.includes(media.id)) {
                    continue;
                }

                finalReviewMedia.push(media);
            }

            finalReviewMedia = finalReviewMedia.concat(newMedia);
            updatedReview.reviewMedia = finalReviewMedia;

            return updatedReview;
        });
    }

    public async createReviewReply(reviewReply: ReviewReply): Promise<ReviewReply> {
        const review: Review | null = await this.reviewRepository.getReviewById(reviewReply.reviewId);
        if (!review) {
            throw new ResponseError("Review not found", 404);
        }

        const existingReviewReply: ReviewReply | null = await this.reviewRepository.getReviewReplyByReviewId(reviewReply.reviewId);
        if (existingReviewReply) {
            throw new ResponseError("Review reply already exists", 400);
        }

        const createdReviewReply: ReviewReply = await this.reviewRepository.createReviewReply(reviewReply);

        return createdReviewReply;
    }

    public async updateReviewReply(reviewReply: ReviewReply): Promise<ReviewReply> {
        const oldReviewReply: ReviewReply | null = await this.reviewRepository.getReviewReplyById(reviewReply.id);
        if (!oldReviewReply) {
            throw new ResponseError("Review reply not found", 404);
        }

        const updatedReviewReply: ReviewReply = await this.reviewRepository.updateReviewReply(reviewReply);

        return updatedReviewReply;
    }

    public async deleteReviewReplyById(id: number): Promise<boolean> {
        const reviewReply: ReviewReply | null = await this.reviewRepository.getReviewReplyById(id);
        if (!reviewReply) {
            throw new ResponseError("Review reply not found", 404);
        }

        const isDeleted: boolean = await this.reviewRepository.deleteReviewReplyById(id);

        return isDeleted;
    }
}