import { PrismaClient } from "@prisma/client";

const prisma: PrismaClient = new PrismaClient();

export async function seedReviewReplies(): Promise<void> {
    await prisma.reviewReply.createMany({
        data: [
            {
                reviewId: 1,
                adminId: 1,
                comment: "Terima kasih telah memberikan review yang baik. Kami akan terus berusaha memberikan pelayanan yang terbaik.",
            },
            {
                reviewId: 2,
                adminId: 1,
                comment: "Terima kasih telah memberikan review yang baik. Kami akan terus berusaha memberikan pelayanan yang terbaik.",
            },
        ],
    })

    console.log('Review Replies seeded successfully');
}