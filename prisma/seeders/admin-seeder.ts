import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma: PrismaClient = new PrismaClient()

export async function seedAdmins(): Promise<void> {
    const hashedPassword: string = await bcrypt.hash('password', 10)

    await prisma.admin.createMany({
        data: [
            {
                fullname: "Super Admin",
                email: "superadmin@prisma.io",
                password: hashedPassword,
                phoneNumber: "1234567890",
                isSuperAdmin: true,
            },
            {
                fullname: "Admin Gedung Adam Malik 1",
                email: "adminadammalik1@prisma.io",
                password: hashedPassword,
                phoneNumber: "1234567890",
                isSuperAdmin: false,
            },
            {
                fullname: "Admin Mess 1",
                email: "adminmess1@prisma.io",
                password: hashedPassword,
                phoneNumber: "1234567890",
                isSuperAdmin: false,
            },
        ],
    });

    console.log("Admins Seeded Successfully");
}