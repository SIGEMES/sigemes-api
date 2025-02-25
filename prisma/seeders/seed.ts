import { PrismaClient } from '@prisma/client'
import { seedRenters } from './renter-seeder'
import { seedAdmins } from './admin-seeder'
import { seedCityHalls } from './city-hall-seeder'
import { seedCityHallMedia } from './city-hall-media-seeder'
import { seedCityHallPricing } from './city-hall-pricing-seeder'
import { seedGuesthouses } from './guesthouse-seeder'
import { seedGuesthouseMedia } from './guesthouse-media-seeder'
import { seedGuesthouseRooms } from './guesthouse-room-seeder'
import { seedGuesthouseRoomMedia } from './guesthouse-room-media-seeder'
import { seedGuesthouseRoomPricing } from './guesthouse-room-pricing-seeder'
import { seedRentPlans } from './rent-plan-seeder'
import { seedRents } from './rent-seeder'

const prisma: PrismaClient = new PrismaClient()

async function main() {
    await seedRenters()
    await seedAdmins()
    await seedCityHalls()
    await seedCityHallMedia()
    await seedCityHallPricing()
    await seedGuesthouses()
    await seedGuesthouseMedia()
    await seedGuesthouseRooms()
    await seedGuesthouseRoomMedia()
    await seedGuesthouseRoomPricing()
    await seedRentPlans()
    await seedRents()
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