import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma: PrismaClient = new PrismaClient()

export async function seedCityHallPricing(): Promise<void> {
    await prisma.cityHallPricing.createMany({
        data: [
            {
                cityHallId: 1,
                activityType: "Komersial",
                facilities: "- Gedung \n- Area Parkir \n- Toilet \n- Ruang Rapat",
                pricePerDay: 1800000,
            },
            {
                cityHallId: 1,
                activityType: "Sosial",
                facilities: "- Gedung \n- Area Parkir \n- Toilet \n- Ruang Rapat",
                pricePerDay: 750000,
            },
            {
                cityHallId: 1,
                activityType: "Instansi Pemerintah",
                facilities: "- Gedung \n- Area Parkir \n- Toilet \n- Ruang Rapat \n- Kursi \n- Panggung \n- Podium \n- Sound System",
                pricePerDay: 1000000,
            },
        ],
    });

    console.log('City Hall Pricing seeded successfully');
};