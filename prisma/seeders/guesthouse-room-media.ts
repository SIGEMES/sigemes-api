import { PrismaClient } from '@prisma/client'

const prisma: PrismaClient = new PrismaClient()

export async function seedGuesthouseRoomMedia(): Promise<void> {
    await prisma.guesthouseRoomMedia.createMany({
        data: [
            {
                guesthouseRoomId: 1,
                url: "https://storage.googleapis.com/sigemes-storage/guesthouse-media/vip1-1.jpeg",
            },
            {
                guesthouseRoomId: 1,
                url: "https://storage.googleapis.com/sigemes-storage/guesthouse-media/vip1-2.jpeg",
            },
            {
                guesthouseRoomId: 1,
                url: "https://storage.googleapis.com/sigemes-storage/guesthouse-media/vip1-3.jpeg",
            },
            {
                guesthouseRoomId: 1,
                url: "https://storage.googleapis.com/sigemes-storage/guesthouse-media/vip1-4.jpeg",
            },
            {
                guesthouseRoomId: 1,
                url: "https://storage.googleapis.com/sigemes-storage/guesthouse-media/vip1-5.jpeg",
            },
            {
                guesthouseRoomId: 1,
                url: "https://storage.googleapis.com/sigemes-storage/guesthouse-media/vip1-6.jpeg",
            },
            {
                guesthouseRoomId: 2,
                url: "https://storage.googleapis.com/sigemes-storage/guesthouse-media/vip2-1.jpeg",
            },
            {
                guesthouseRoomId: 2,
                url: "https://storage.googleapis.com/sigemes-storage/guesthouse-media/vip2-2.jpeg",
            },
            {
                guesthouseRoomId: 2,
                url: "https://storage.googleapis.com/sigemes-storage/guesthouse-media/vip2-3.jpeg",
            },
            {
                guesthouseRoomId: 2,
                url: "https://storage.googleapis.com/sigemes-storage/guesthouse-media/vip2-4.jpeg",
            },
            {
                guesthouseRoomId: 2,
                url: "https://storage.googleapis.com/sigemes-storage/guesthouse-media/vip2-5.jpeg",
            },
            {
                guesthouseRoomId: 2,
                url: "https://storage.googleapis.com/sigemes-storage/guesthouse-media/vip2-6.jpeg",
            },
            {
                guesthouseRoomId: 3,
                url: "https://storage.googleapis.com/sigemes-storage/guesthouse-media/vip3-1.jpeg",
            },
            {
                guesthouseRoomId: 3,
                url: "https://storage.googleapis.com/sigemes-storage/guesthouse-media/vip3-2.jpeg",
            },
            {
                guesthouseRoomId: 3,
                url: "https://storage.googleapis.com/sigemes-storage/guesthouse-media/vip3-3.jpeg",
            },
            {
                guesthouseRoomId: 3,
                url: "https://storage.googleapis.com/sigemes-storage/guesthouse-media/vip3-4.jpeg",
            },
            {
                guesthouseRoomId: 3,
                url: "https://storage.googleapis.com/sigemes-storage/guesthouse-media/vip3-5.jpeg",
            },
            {
                guesthouseRoomId: 3,
                url: "https://storage.googleapis.com/sigemes-storage/guesthouse-media/vip3-6.jpeg",
            },
            {
                guesthouseRoomId: 4,
                url: "https://storage.googleapis.com/sigemes-storage/guesthouse-media/vip1-1.jpeg",
            },
            {
                guesthouseRoomId: 4,
                url: "https://storage.googleapis.com/sigemes-storage/guesthouse-media/vip1-2.jpeg",
            },
            {
                guesthouseRoomId: 5,
                url: "https://storage.googleapis.com/sigemes-storage/guesthouse-media/vip2-1.jpeg",
            },
            {
                guesthouseRoomId: 5,
                url: "https://storage.googleapis.com/sigemes-storage/guesthouse-media/vip2-2.jpeg",
            },
            {
                guesthouseRoomId: 6,
                url: "https://storage.googleapis.com/sigemes-storage/guesthouse-media/vip3-1.jpeg",
            },
            {
                guesthouseRoomId: 6,
                url: "https://storage.googleapis.com/sigemes-storage/guesthouse-media/vip3-2.jpeg",
            },
        ],
    });

    console.log('Guesthouse Room Media seeded successfully');
}