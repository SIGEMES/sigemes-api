const { PrismaClient } = require('@prisma/client')

export const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL, // Ensure this is correctly set
        },
    },
    transactionOptions: {
        maxWait: 10000, // Increase wait time before starting a transaction (default: 2000ms)
        timeout: 15000, // Extend transaction timeout (default: 5000ms)
    },
});