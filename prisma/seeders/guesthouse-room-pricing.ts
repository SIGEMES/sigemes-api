import { PrismaClient } from '@prisma/client'

const prisma: PrismaClient = new PrismaClient()

export async function seedGuesthouseRoomPricing(): Promise<void> {
    await prisma.guesthouseRoomPricing.createMany({
        data: [
            {
                guesthouseRoomId: 1,
                retributionType: "Pejabat Negara / Pejabat Pemerintah",
                pricePerDay: 80000,
            },
            {
                guesthouseRoomId: 1,
                retributionType: "PNS (Gol. II, III, dan IV)",
                pricePerDay: 70000,
            },
            {
                guesthouseRoomId: 1,
                retributionType: "Umum",
                pricePerDay: 85000,
            },
            {
                guesthouseRoomId: 1,
                retributionType: "Khusus Booking 1 Kamar",
                pricePerDay: 125000,
            },
            {
                guesthouseRoomId: 2,
                retributionType: "Pejabat Negara / Pejabat Pemerintah",
                pricePerDay: 80000,
            },
            {
                guesthouseRoomId: 2,
                retributionType: "PNS (Gol. II, III, dan IV)",
                pricePerDay: 70000,
            },
            {
                guesthouseRoomId: 2,
                retributionType: "Umum",
                pricePerDay: 85000,
            },
            {
                guesthouseRoomId: 2,
                retributionType: "Khusus Booking 1 Kamar",
                pricePerDay: 125000,
            },
            {
                guesthouseRoomId: 3,
                retributionType: "Pejabat Negara / Pejabat Pemerintah",
                pricePerDay: 80000,
            },
            {
                guesthouseRoomId: 3,
                retributionType: "PNS (Gol. II, III, dan IV)",
                pricePerDay: 70000,
            },
            {
                guesthouseRoomId: 3,
                retributionType: "Umum",
                pricePerDay: 85000,
            },
            {
                guesthouseRoomId: 3,
                retributionType: "Khusus Booking 1 Kamar",
                pricePerDay: 125000,
            },
            {
                guesthouseRoomId: 4,
                retributionType: "PNS (Gol. IV)",
                pricePerDay: 65000,
            },
            {
                guesthouseRoomId: 4,
                retributionType: "PNS (Gol. III dan Gol, II)",
                pricePerDay: 60000,
            },
            {
                guesthouseRoomId: 4,
                retributionType: "Umum",
                pricePerDay: 75000,
            },
            {
                guesthouseRoomId: 4,
                retributionType: "Khusus Booking 1 Kamar",
                pricePerDay: 110000,
            },
            {
                guesthouseRoomId: 5,
                retributionType: "PNS (Gol. IV)",
                pricePerDay: 65000,
            },
            {
                guesthouseRoomId: 5,
                retributionType: "PNS (Gol. III dan Gol, II)",
                pricePerDay: 60000,
            },
            {
                guesthouseRoomId: 5,
                retributionType: "Umum",
                pricePerDay: 75000,
            },
            {
                guesthouseRoomId: 5,
                retributionType: "Khusus Booking 1 Kamar",
                pricePerDay: 110000,
            },
            {
                guesthouseRoomId: 6,
                retributionType: "PNS (Gol. IV)",
                pricePerDay: 65000,
            },
            {
                guesthouseRoomId: 6,
                retributionType: "PNS (Gol. III dan Gol, II)",
                pricePerDay: 60000,
            },
            {
                guesthouseRoomId: 6,
                retributionType: "Umum",
                pricePerDay: 75000,
            },
            {
                guesthouseRoomId: 6,
                retributionType: "Khusus Booking 1 Kamar",
                pricePerDay: 110000,
            },
        ],
    });
}