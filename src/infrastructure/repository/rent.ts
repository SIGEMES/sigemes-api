import { PrismaClient } from "@prisma/client";
import { RentRepositoryInterface } from "../../domain/interface/repository/rent";
import { Rent } from "../../domain/entity/rent";

export class RentRepository implements RentRepositoryInterface {
    constructor(private prisma: PrismaClient) { }

    public async getAllRents(): Promise<Rent[]> {
        const rents: Rent[] = await this.prisma.rent.findMany({
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
            },
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
            },
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
            },
        }) as Rent;

        return rent;
    }

    public async getActiveRentsByGuesthouseRoomPricingIds(guesthouseRoomPricingIds: number[]): Promise<Rent[]> {
        const rents: Rent[] = await this.prisma.rent.findMany({
            where: {
                guesthouseRoomPricingId: {
                    in: guesthouseRoomPricingIds,
                },
                status: {
                    in: ['pending', 'dikonfirmasi'],
                }
            },
        }) as Rent[];

        return rents;
    }
    
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
                        endDate: { gte: startDate }
                    }
                ]
            },
        }) as Rent[];

        return rents;
    }

    public async getActiveRentsByCityHallPricingIds(cityHallPricingIds: number[]): Promise<Rent[]> {
        const rents: Rent[] = await this.prisma.rent.findMany({
            where: {
                cityHallPricingId: {
                    in: cityHallPricingIds,
                },
                status: {
                    in: ['pending', 'dikonfirmasi'],
                }
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
            },
        }) as Rent;

        return createdRent;
    }

    public async updateRentStatus(rentId: number, rentStatus: string, transaction?: any): Promise<Rent> {
        const prisma = transaction || this.prisma;

        const updatedRent: Rent = await prisma.rent.update({
            where: {
                id: rentId,
            },
            data: {
                rentStatus: rentStatus,
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
            },
        }) as Rent;

        return updatedRent;
    }

    public async updateRentCheckIn(rentId: number, transaction?: any): Promise<Rent> {
        const prisma = transaction || this.prisma;

        const updatedRent: Rent = await prisma.rent.update({
            where: {
                id: rentId,
            },
            data: {
                checkIn: new Date(),
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
            },
        }) as Rent;

        return updatedRent;
    }

    public async updateRentCheckOut(rentId: number, transaction?: any): Promise<Rent> {
        const prisma = transaction || this.prisma;

        const updatedRent: Rent = await prisma.rent.update({
            where: {
                id: rentId,
            },
            data: {
                checkOut: new Date(),
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
            },
        }) as Rent;

        return updatedRent;
    }
}