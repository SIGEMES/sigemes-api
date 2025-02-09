import { PrismaClient } from '@prisma/client'

const prisma: PrismaClient = new PrismaClient()

export async function seedGuesthouseMedia(): Promise<void> {
    await prisma.guesthouseMedia.createMany({
        data: [
            {
                guesthouseId: 1,
                url: "https://storage.googleapis.com/sigemes-storage/guesthouse-media/mess-padangsidempuan-dalam.png",
            },
            {
                guesthouseId: 1,
                url: "https://storage.googleapis.com/sigemes-storage/guesthouse-media/mess-padangsidempuan-luar.png",
            },
        ],
    });

    console.log('Guesthouse Media seeded successfully');
}