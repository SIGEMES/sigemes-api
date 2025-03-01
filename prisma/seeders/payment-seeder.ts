import { PrismaClient } from '@prisma/client'

const prisma: PrismaClient = new PrismaClient()

export async function seedPayments(): Promise<void> {
    await prisma.payment.createMany({
        data: [
            {
                rentId: 1,
                amount: 99999,
                method: "qris",
                status: "dibayar",
                paymentTriggeredAt: new Date('2025-01-10'),
                paymentConfirmedAt: new Date('2025-01-10')
            },
            {
                rentId: 2,
                amount: 200000,
                method: "bank_transfer",
                status: "dibayar",
                paymentTriggeredAt: new Date('2025-01-15'),
                paymentConfirmedAt: new Date('2025-01-15')
            },
            {
                rentId: 3,
                amount: 300000,
                method: "bank_transfer",
                status: "dibayar",
                paymentTriggeredAt: new Date('2025-01-25'),
                paymentConfirmedAt: new Date('2025-01-26')
            },
            {
                rentId: 4,
                amount: 400000,
                method: "bank_transfer",
                status: "dibayar",
                paymentTriggeredAt: new Date('2025-01-30'),
                paymentConfirmedAt: new Date('2025-01-31')
            },
        ],
    });

}