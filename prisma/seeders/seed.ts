import { PrismaClient } from '@prisma/client'
import { seedRenters } from './renter-seeder'
import { seedAdmins } from './admin-seeder'

const prisma: PrismaClient = new PrismaClient()

async function main() {
    await seedRenters()
    await seedAdmins()
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })