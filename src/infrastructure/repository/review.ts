import { PrismaClient } from "@prisma/client";
import { ReviewRepositoryInterface } from "../../domain/interface/repository/review";
import { Review } from "../../domain/entity/review";
import { ReviewMedia } from "../../domain/entity/review-media";

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