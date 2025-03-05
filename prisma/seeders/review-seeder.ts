import { PrismaClient } from "@prisma/client";

const prisma: PrismaClient = new PrismaClient();

export async function seedReviews(): Promise<void> {
    await prisma.review.createMany({
        data: [
            {
                rentId: 2,
                rating: 5,
                comment: "Kamar messnya bersih dan nyaman, pelayanannya juga ramah. Selain itu fasilitasnya juga lengkap. Sangat puas menginap disini.",
            },
            {
                rentId: 4,
                rating: 5,
                comment: "Gedung adam malik sangat bersih, fasilitas yang diediajukan juga lengkap. Pelayanannya juga ramah.",
            },
        ],
    })

    console.log('Reviews seeded successfully');
}