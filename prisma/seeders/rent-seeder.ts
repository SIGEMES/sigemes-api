import { Rent, PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma: PrismaClient = new PrismaClient();

export async function seedRents(): Promise<void> {
  await prisma.rent.createMany({
    data: [
        {
            renterId: 2,
            guesthouseRoomPricingId: 1,
            slot: 1,
            startDate: new Date('2025-02-25'),
            endDate: new Date('2025-02-27'),
            renterGender: "laki_laki",
            status: "dikonfirmasi",
        },
        {
            renterId: 2,
            guesthouseRoomPricingId: 10,
            slot: 2,
            startDate: new Date('2025-02-25'),
            endDate: new Date('2025-02-27'),
            renterGender: "laki_laki",
            status: "selesai",
        },
        {
            renterId: 1,
            guesthouseRoomPricingId: 6,
            slot: 1,
            startDate: new Date('2025-02-28'),
            endDate: new Date('2025-03-01'),
            renterGender: "perempuan",
            status: "dikonfirmasi",
        },
        {
            renterId: 1,
            cityHallPricingId: 1,
            slot: 1,
            startDate: new Date('2025-02-25'),
            endDate: new Date('2025-02-27'),
            renterGender: "perempuan",
            status: "selesai",
        },
    ],
  })

}