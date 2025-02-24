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
}