const { PrismaClient } = require('@prisma/client')

export const prisma: typeof PrismaClient = new PrismaClient();