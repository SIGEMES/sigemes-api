import { PrismaClient } from '@prisma/client'
import { seedRenters } from './renter-seeder'
import { seedAdmins } from './admin-seeder'
import { seedCityHalls } from './city-hall-seeder'
import { seedCityHallMedia } from './city-hall-media-seeder'
import { seedCityHallPricing } from './city-hall-pricing-seeder'

const prisma: PrismaClient = new PrismaClient()

async function main() {
    await seedRenters()
    await seedAdmins()
    await seedCityHalls()
    await seedCityHallMedia()
    await seedCityHallPricing()
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