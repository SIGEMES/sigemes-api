import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma: PrismaClient = new PrismaClient()

export async function seedCityHallMedia(): Promise<void> {
    await prisma.cityHallMedia.createMany({
        data: [
            {
                cityHallId: 1,
                url: "https://storage.googleapis.com/sigemes-storage/city-hall-media/adam-malik-depan.jpg",
            },
            {
                cityHallId: 1,
                url: "https://storage.googleapis.com/sigemes-storage/city-hall-media/adam-malik-dalam.jpg",
            },
        ],
    });

    console.log('City Hall Media seeded successfully');
};