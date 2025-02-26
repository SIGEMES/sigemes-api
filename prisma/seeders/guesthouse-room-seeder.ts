import { PrismaClient } from '@prisma/client'

const prisma: PrismaClient = new PrismaClient()

export async function seedGuesthouseRooms(): Promise<void> {
    await prisma.guesthouseRoom.createMany({
        data: [
            {
                guesthouseId: 1,
                name: "VIP 1",
                type: "vip",
                facilities: "King-size bed; AC; TV; Meja rias; Kamar mandi dalam; Toilet duduk; Lemari (2)",
                areaM2: 100,
                totalSlot:2
            },
            {
                guesthouseId: 1,
                name: "VIP 2",
                type: "vip",
                facilities: "King-size bed; Personal-size bed; AC; TV; Lemari; Meja rias; Kamar mandi dalam; Toilet duduk",
                areaM2: 100,
                totalSlot:3
            },
            {
                guesthouseId: 1,
                name: "VIP 3",
                type: "vip",
                facilities: "Twin bed (2); AC; Kamar mandi dalam; Toilet duduk",
                areaM2: 100,
                totalSlot:2
            },
            {
                guesthouseId: 1,
                name: "Standard 1",
                type: "standard",
                facilities: "King size bed (2); Kamar mandi dalam",
                areaM2: 100,
                totalSlot:1
            },
            {
                guesthouseId: 1,
                name: "Standard 2",
                type: "standard",
                facilities: "King size bed; Single bed; Kamar mandi dalam",
                areaM2: 100,
                totalSlot:2
            },
            {
                guesthouseId: 1,
                name: "Standard 3",
                type: "standard",
                facilities: "King size bed; Kamar mandi luar",
                areaM2: 100,
                totalSlot:1
            }
        ],
    });

    console.log('Guesthouse Room seeded successfully');
}