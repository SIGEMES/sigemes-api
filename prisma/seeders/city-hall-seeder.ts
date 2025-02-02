import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma: PrismaClient = new PrismaClient()

export async function seedCityHalls(): Promise<void> {
    await prisma.cityHall.createMany({
        data: [
            {
                name: "Gedung Adam Malik",
                description: "Gedung Adam Malik adalah gedung pertemuan yang dapat digunakan untuk berbagai kegiatan seperti kegiatan sosial, komersial, maupun pemerintahan.",
                areaM2: 1000,
                peopleCapacity: 1000,
                address: "Jl. Adam Malik No. 1",
                latitude: 1.378624,
                longitude: 99.272306,
                status: "tersedia",
                contactPerson: "081234567890",
            },
        ],
    });

    console.log('City Hall seeded successfully');
};