import { PrismaClient } from '@prisma/client'

const prisma: PrismaClient = new PrismaClient()

export async function seedRentPlans(): Promise<void> {
    await prisma.rentPlan.createMany({
        data: [
            {
                renterId: 2,
                guesthouseRoomPricingId: 1,
                slot: 1,
                startDate: new Date('2025-02-25'),
                endDate: new Date('2025-02-27'),
                renterGender: "laki_laki",
            },
            {
                renterId: 2,
                guesthouseRoomPricingId: 10,
                slot: 2,
                startDate: new Date('2025-02-25'),
                endDate: new Date('2025-02-27'),
                renterGender: "laki_laki",
            },
            {
                renterId: 1,
                guesthouseRoomPricingId: 6,
                slot: 1,
                startDate: new Date('2025-02-28'),
                endDate: new Date('2025-03-01'),
                renterGender: "perempuan",
            },
            {
                renterId: 1,
                cityHallPricingId: 1,
                slot: 1,
                startDate: new Date('2025-02-25'),
                endDate: new Date('2025-02-27'),
                renterGender: "perempuan",
            },
        ],
    });

    console.log('Rent Plan seeded successfully');
}