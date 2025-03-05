import { PrismaClient } from "@prisma/client";
import { ReviewRepositoryInterface } from "../../domain/interface/repository/review";
import { Review } from "../../domain/entity/review";
import { ReviewMedia } from "../../domain/entity/review-media";
import { ReviewReply } from "../../domain/entity/review-reply";

export class ReviewRepository implements ReviewRepositoryInterface {
    private prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    public async getReviewsByCityHallId(cityHallId: number): Promise<Review[]> {
        const reviews: Review[] = await this.prisma.review.findMany({
            where: {
                rent: {
                    cityHallPricing: {
                        cityHallId: cityHallId,
                    },
                },
            },
            include: {
                reviewMedia: true,
                rent: {
                    include: {
                        cityHallPricing: true,
                        renter: true,
                    }
                },
                reviewReply: true,
            },
        }) as Review[];

        return reviews;
    }

    public async getReviewsByGuesthouseRoomId(guesthouseRoomId: number): Promise<Review[]> {
        const reviews: Review[] = await this.prisma.review.findMany({
            where: {
                rent: {
                    guesthouseRoomPricing: {
                        guesthouseRoomId: guesthouseRoomId,
                    },
                },
            },
            include: {
                reviewMedia: true,
                rent: {
                    include: {
                        guesthouseRoomPricing: true,
                        renter: true,
                    }
                },
                reviewReply: true,
            },
        }) as Review[];

        return reviews;
    }

    public async getReviewById(id: number): Promise<Review> {
        const review: Review = await this.prisma.review.findUnique({
            where: {
                id: id,
            },
            include: {
                reviewMedia: true,
                rent: {
                    include: {
                        cityHallPricing: true,
                        guesthouseRoomPricing: true,
                        renter: true,
                    }
                },
                reviewReply: true,
            },
        }) as Review;

        return review;
    }

    public async getReviewByRentId(rentId: number): Promise<Review> {
        const review: Review = await this.prisma.review.findFirst({
            where: {
                rentId: rentId,
            },
            include: {
                reviewMedia: true,
                rent: {
                    include: {
                        cityHallPricing: true,
                        guesthouseRoomPricing: true,
                        renter: true,
                    }
                },
                reviewReply: true,
            },
        }) as Review;

        return review;
    }

    public async getReviewReplyByReviewId(reviewId: number): Promise<ReviewReply> {
        const reviewReply: ReviewReply = await this.prisma.reviewReply.findFirst({
            where: {
                reviewId: reviewId,
            },
        }) as ReviewReply;

        return reviewReply;
    }

    public async getReviewReplyById(id: number): Promise<ReviewReply> {
        const reviewReply: ReviewReply = await this.prisma.reviewReply.findUnique({
            where: {
                id: id,
            },
        }) as ReviewReply;

        return reviewReply;
    }

    public async createReview(review: Review): Promise<Review> {
        const createdReview: Review = await this.prisma.review.create({
            data: {
                rentId: review.rentId,
                rating: review.rating,
                comment: review.comment,
                reviewMedia: {
                    create: review.reviewMedia.map(media => ({
                        url: media.url,
                    })),
                },
            },
            include: {
                reviewMedia: true,
                rent: {
                    include: {
                        cityHallPricing: true,
                        guesthouseRoomPricing: true,
                        renter: true,
                    }
                },
                reviewReply: true,
            },
        }) as Review;

        return createdReview;
    }

    public async updateReviewOnly(review: Review, transaction?: any): Promise<Review> {
        const prisma = transaction || this.prisma;

        const updatedReview: Review = await prisma.review.update({
            where: {
                id: review.id,
            },
            data: {
                rating: review.rating,
                comment: review.comment,
            },
            include: {
                reviewMedia: true,
                rent: {
                    include: {
                        cityHallPricing: true,
                        guesthouseRoomPricing: true,
                        renter: true,
                    }
                },
                reviewReply: true,
            },
        }) as Review;

        return updatedReview;
    }

    public async createReviewMedia(reviewMedia: ReviewMedia[], transaction?: any): Promise<ReviewMedia[]> {
        const prisma = transaction || this.prisma;

        const createdReviewMedia: ReviewMedia[] = await prisma.reviewMedia.createManyAndReturn({
            data: reviewMedia.map(media => ({
                reviewId: media.reviewId,
                url: media.url,
            })),
            select: {
                id: true,
                url: true,
            },
        }) as ReviewMedia[];

        return createdReviewMedia;
    }
    
    public async createReviewReply(reviewReply: ReviewReply): Promise<ReviewReply> {
        const createdReviewReply: ReviewReply = await this.prisma.reviewReply.create({
            data: {
                reviewId: reviewReply.reviewId,
                adminId: reviewReply.adminId,
                comment : reviewReply.comment,
            },
        }) as ReviewReply;

        return createdReviewReply;
    }

    public async updateReviewReply(reviewReply: ReviewReply): Promise<ReviewReply> {
        const updatedReviewReply: ReviewReply = await this.prisma.reviewReply.update({
            where: {
                id: reviewReply.id,
            },
            data: {
                adminId: reviewReply.adminId,
                comment: reviewReply.comment,
            },
        }) as ReviewReply;

        return updatedReviewReply;
    }

    public async deleteReviewReplyById(reviewReplyId: number): Promise<boolean> {
        await this.prisma.reviewReply.delete({
            where: {
                id: reviewReplyId,
            },
        });

        return true;
    }

    public async deleteReviewMediaByIds(ids: number[], transaction?: any): Promise<boolean> {
        const prisma = transaction || this.prisma;

        await prisma.reviewMedia.deleteMany({
            where: {
                id: {
                    in: ids,
                },
            },
        });

        return true;
    }
}