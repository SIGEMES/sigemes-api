import { PrismaClient } from "@prisma/client";
import { RentRepositoryInterface } from "../../domain/interface/repository/rent";
import { Rent, RentFilter, RentStatus } from "../../domain/entity/rent";

export class RentRepository implements RentRepositoryInterface {
    constructor(private prisma: PrismaClient) { }

    public async getCountRents(whereConditions: any): Promise<number> {
        const count: number = await this.prisma.rent.count({
            where: {
                ...whereConditions,
            },
        });

        return count;
    }

    public async getAllRents(page: number, limit: number, whereConditions: any): Promise<Rent[]> {
        const rents: Rent[] = await this.prisma.rent.findMany({
            skip: (page - 1) * limit,
            take: limit,
            where: {
                ...whereConditions,
            },
            include: {
                guesthouseRoomPricing: {
                    include: {
                        guesthouseRoom: {
                            include: {
                                guesthouseRoomMedia: true,
                                guesthouse: {
                                    include: {
                                        guesthouseMedia: true,
                                    },
                                },
                            },
                        },
                    },
                },
                cityHallPricing: {
                    include: {
                        cityHall: {
                            include: {
                                cityHallMedia: true,
                            },
                        },
                    },
                },
                payment: true,
                renter: true,
            },
            orderBy: {
                id: 'desc',
            }
        }) as Rent[];

        return rents;
    }

    public async getAllRentsByRenterId(renterId: number): Promise<Rent[]> {
        const rents: Rent[] = await this.prisma.rent.findMany({
            where: {
                renterId: renterId,
            },
            include: {
                guesthouseRoomPricing: {
                    include: {
                        guesthouseRoom: {
                            include: {
                                guesthouseRoomMedia: true,
                                guesthouse: {
                                    include: {
                                        guesthouseMedia: true,
                                    },
                                },
                            },
                        },
                    },
                },
                cityHallPricing: {
                    include: {
                        cityHall: {
                            include: {
                                cityHallMedia: true,
                            },
                        },
                    },
                },
                payment: true,
            },
            orderBy: {
                id: 'desc',
            }
        }) as Rent[];

        return rents;
    }

    public async getRentById(rentId: number): Promise<Rent> {
        const rent: Rent = await this.prisma.rent.findUnique({
            where: {
                id: rentId,
            },
            include: {
                guesthouseRoomPricing: {
                    include: {
                        guesthouseRoom: {
                            include: {
                                guesthouseRoomMedia: true,
                                guesthouse: {
                                    include: {
                                        guesthouseMedia: true,
                                    },
                                },
                            },
                        },
                    },
                },
                cityHallPricing: {
                    include: {
                        cityHall: {
                            include: {
                                cityHallMedia: true,
                            },
                        },
                    },
                },
                payment: true,
                renter: true,
            },
        }) as Rent;

        return rent;
    }

    public async getRentByIdWithReview(rentId: number): Promise<Rent> {
        const rent: Rent = await this.prisma.rent.findUnique({
            where: {
                id: rentId,
            },
            include: {
                renter: true,
                review: true,
            },
        }) as Rent;

        return rent;
    };

    public async getFilteredActiveRentsByGuesthouseRoomPricingIds(guesthouseRoomPricingIds: number[], startDate: Date, endDate: Date): Promise<Rent[]> {
        const rents: Rent[] = await this.prisma.rent.findMany({
            where: {
                guesthouseRoomPricingId: {
                    in: guesthouseRoomPricingIds,
                },
                status: {
                    in: ['pending', 'dikonfirmasi'],
                },
                AND: [
                    {
                        startDate: { lte: endDate }
                    },
                    {
                        OR: [
                            {
                                checkOut: null,
                                endDate: { gte: startDate }
                            },
                            {
                                checkOut: { not: null, gte: startDate }
                            }
                        ],
                    },
                ],
            },
            include: {
                payment: true,
            },
        }) as Rent[];

        return rents;
    }

    public async getFilteredActiveRentsByCityHallPricingIds(cityHallPricingIds: number[], startDate: Date, endDate: Date): Promise<Rent[]> {
        const rents: Rent[] = await this.prisma.rent.findMany({
            where: {
                cityHallPricingId: {
                    in: cityHallPricingIds,
                },
                status: {
                    in: ['pending', 'dikonfirmasi'],
                },
                AND: [
                    {
                        startDate: { lte: endDate }
                    },
                    {
                        OR: [
                            {
                                checkOut: null,
                                endDate: { gte: startDate }
                            },
                            {
                                checkOut: { not: null, gte: startDate }
                            }
                        ],
                    },
                ],
            },
            include: {
                payment: true,
            },
        }) as Rent[];

        return rents;
    }

    public async createRent(rent: Rent, transaction?: any): Promise<Rent> {
        const prisma = transaction || this.prisma;

        const createdRent: Rent = await prisma.rent.create({
            data: {
                renterId: rent.renterId,
                guesthouseRoomPricingId: rent.guesthouseRoomPricingId,
                cityHallPricingId: rent.cityHallPricingId,
                slot: rent.slot,
                startDate: rent.startDate,
                endDate: rent.endDate,
                renterGender: rent.renterGender,
            },
            include: {
                guesthouseRoomPricing: {
                    include: {
                        guesthouseRoom: {
                            include: {
                                guesthouseRoomMedia: true,
                                guesthouse: {
                                    include: {
                                        guesthouseMedia: true,
                                    },
                                },
                            },
                        },
                    },
                },
                cityHallPricing: {
                    include: {
                        cityHall: {
                            include: {
                                cityHallMedia: true,
                            },
                        },
                    },
                },
                renter: true,
            },
        }) as Rent;

        return createdRent;
    }

    public async updateRentStatus(rentId: number, rentStatus: RentStatus, transaction?: any): Promise<Rent> {
        const prisma = transaction || this.prisma;

        const updatedRent: Rent = await prisma.rent.update({
            where: {
                id: rentId,
            },
            data: {
                status: rentStatus,
            },
            include: {
                guesthouseRoomPricing: {
                    include: {
                        guesthouseRoom: {
                            include: {
                                guesthouseRoomMedia: true,
                                guesthouse: {
                                    include: {
                                        guesthouseMedia: true,
                                    },
                                },
                            },
                        },
                    },
                },
                cityHallPricing: {
                    include: {
                        cityHall: {
                            include: {
                                cityHallMedia: true,
                            },
                        },
                    },
                },
                payment: true,
            },
        }) as Rent;

        return updatedRent;
    }

    public async updateRentCheckIn(rentId: number, transaction?: any): Promise<void> {
        const prisma = transaction || this.prisma;

        await prisma.rent.update({
            where: { id: rentId },
            data: { checkIn: new Date() },
            select: { id: true },
        })
    }

    public async updateRentCheckOut(rentId: number, transaction?: any): Promise<void> {
        const prisma = transaction || this.prisma;

        await prisma.rent.update({
            where: { id: rentId },
            data: { 
                checkOut: new Date(),
                status: "selesai",
            },
            select: { id: true },
        });
    }
}