import { PrismaClient } from '@prisma/client'

const prisma: PrismaClient = new PrismaClient()

export async function seedGuesthouseRoomMedia(): Promise<void> {
    await prisma.guesthouseRoomMedia.createMany({
        data: [
            {
                guesthouseRoomId: 1,
                url: "https://storage.googleapis.com/sigemes-storage/guesthouse-room-media/padangsidempuan-vip1-1.jpeg",
            },
            {
                guesthouseRoomId: 1,
                url: "https://storage.googleapis.com/sigemes-storage/guesthouse-room-media/padangsidempuan-vip1-2.jpeg",
            },
            {
                guesthouseRoomId: 2,
                url: "https://storage.googleapis.com/sigemes-storage/guesthouse-room-media/padangsidempuan-vip2-1.jpeg",
            },
            {
                guesthouseRoomId: 2,
                url: "https://storage.googleapis.com/sigemes-storage/guesthouse-room-media/padangsidempuan-vip2-2.jpeg",
            },
            {
                guesthouseRoomId: 3,
                url: "https://storage.googleapis.com/sigemes-storage/guesthouse-room-media/padangsidempuan-vip3-1.jpeg",
            },
            {
                guesthouseRoomId: 3,
                url: "https://storage.googleapis.com/sigemes-storage/guesthouse-room-media/padangsidempuan-vip3-2.jpeg",
            },
            {
                guesthouseRoomId: 4,
                url: "https://storage.googleapis.com/sigemes-storage/guesthouse-room-media/padangsidempuan-standard1-1.jpeg",
            },
            {
                guesthouseRoomId: 4,
                url: "https://storage.googleapis.com/sigemes-storage/guesthouse-room-media/padangsidempuan-standard1-2.jpeg",
            },
            {
                guesthouseRoomId: 5,
                url: "https://storage.googleapis.com/sigemes-storage/guesthouse-room-media/padangsidempuan-standard2-1.jpeg",
            },
            {
                guesthouseRoomId: 5,
                url: "https://storage.googleapis.com/sigemes-storage/guesthouse-room-media/padangsidempuan-standard2-2.jpeg",
            },
            {
                guesthouseRoomId: 6,
                url: "https://storage.googleapis.com/sigemes-storage/guesthouse-room-media/padangsidempuan-standard3-1.jpeg",
            },
            {
                guesthouseRoomId: 6,
                url: "https://storage.googleapis.com/sigemes-storage/guesthouse-room-media/padangsidempuan-standard3-2.jpeg",
            },
        ],
    });

    console.log('Guesthouse Room Media seeded successfully');
}