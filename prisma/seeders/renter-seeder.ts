import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma: PrismaClient = new PrismaClient()

export async function seedRenters(): Promise<void> {
    const hashedPassword: string = await bcrypt.hash('password', 10)

    await prisma.renter.createMany({
        data: [
            {
                fullname: "Alice Jones",
                email: "alice@prisma.io",
                password: hashedPassword,
                email_verified: true,
                gender: "female",
            },
            {
                fullname: "Bob Smith",
                email: "bob@prisma.io",
                password: hashedPassword,
                email_verified: true,
                gender: "male",
            },
            {
                fullname: "Charlie Brown",
                email: "charlie@prisma.io",
                password: hashedPassword,
                email_verified: false,
                gender: "male"
            },
        ],
    });

    console.log("Renters Seeded Successfully");
}