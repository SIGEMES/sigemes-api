import { PrismaClient } from "@prisma/client";

const prisma: PrismaClient = new PrismaClient();

export async function seedReviewMedia(): Promise<void> {
    await prisma.reviewMedia.createMany({
        data: [
            {
                reviewId: 1,
                url: "https://storage.googleapis.com/sigemes-storage/review-media/vip1-2.jpeg",
            },
            {
                reviewId: 1,
                url: "https://storage.googleapis.com/sigemes-storage/review-media/vip1-4.jpeg",
            },
            {
                reviewId: 2,
                url: "https://storage.googleapis.com/sigemes-storage/review-media/adam-malik-dalam.jpeg",
            },
            {
                reviewId: 2,
                url: "https://storage.googleapis.com/sigemes-storage/review-media/adam-malik-depan.jpeg",
            },
        ],
    })

    console.log('Review Media seeded successfully');
}