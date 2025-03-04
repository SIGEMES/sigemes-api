import { PrismaClient } from "@prisma/client";
import { ReviewRepositoryInterface } from "../../domain/interface/repository/review";
import { Review } from "../../domain/entity/review";

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
                    include:{
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
                    include:{
                        guesthouseRoomPricing: true,
                        renter: true,
                    }
                },
                reviewReply: true,
            },
        }) as Review[];

        return reviews;
    }
}