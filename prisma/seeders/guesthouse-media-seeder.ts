import { PrismaClient } from '@prisma/client'

const prisma: PrismaClient = new PrismaClient()

export async function seedGuesthouseMedia(): Promise<void> {
    await prisma.guesthouseMedia.createMany({
        data: [
            {
                guesthouseId: 1,
                url: "https://storage.googleapis.com/sigemes-storage/guesthouse-media/mess-padangsidimpuan1.jpg",
            },
            {
                guesthouseId: 1,
                url: "https://storage.googleapis.com/sigemes-storage/guesthouse-media/mess-padangsidimpuan2.png",
            },
            {
                guesthouseId: 1,
                url: "https://storage.googleapis.com/sigemes-storage/guesthouse-media/mess-padangsidimpuan-dalam1.jpeg",
            },
            {
                guesthouseId: 1,
                url: "https://storage.googleapis.com/sigemes-storage/guesthouse-media/mess-padangsidimpuan-dalam2.jpeg",
            },
            {
                guesthouseId: 1,
                url: "https://storage.googleapis.com/sigemes-storage/guesthouse-media/mess-padangsidimpuan-dalam3.jpeg",
            },
            {
                guesthouseId: 1,
                url: "https://storage.googleapis.com/sigemes-storage/guesthouse-media/mess-padangsidimpuan-dalam4.jpeg",
            },
            {
                guesthouseId: 1,
                url: "https://storage.googleapis.com/sigemes-storage/guesthouse-media/mess-padangsidimpuan-dalam5.jpeg",
            },
        ],
    });

    console.log('Guesthouse Media seeded successfully');
}