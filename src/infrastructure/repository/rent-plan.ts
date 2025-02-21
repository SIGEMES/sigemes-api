import { PrismaClient } from "@prisma/client";
import { RentPlanRepositoryInterface } from "../../domain/interface/repository/rent-plan";
import { RentPlan } from "../../domain/entity/rent-plan";

export class RentPlanRepository implements RentPlanRepositoryInterface {
    constructor(private prisma: PrismaClient) { }

    public async getAllRenterRentPlans(userId: number): Promise<RentPlan[]> {
        const rentPlans: RentPlan[] = await this.prisma.rentPlan.findMany({
            where: {
                renterId: userId
            },
            include: {
                renter: true,
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
        }) as RentPlan[];

        return rentPlans;
    }

    async getRentPlanById(rentPlanId: number): Promise<RentPlan> {
        const rentPlan: RentPlan = await this.prisma.rentPlan.findUnique({
            where: {
                id: rentPlanId,
            },
            include: {
                renter: true,
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
        }) as RentPlan;

        return rentPlan;
    }

    async createRentPlan(rentPlan: RentPlan): Promise<RentPlan> {
        const newRentPlan: RentPlan = await this.prisma.rentPlan.create({
            data: {
                renterId: rentPlan.renterId,
                guesthouseRoomPricingId: rentPlan.guesthouseRoomPricingId,
                cityHallPricingId: rentPlan.cityHallPricingId,
                slot: rentPlan.slot,
                startDate: rentPlan.startDate,
                endDate: rentPlan.endDate,
                renterGender: rentPlan.renterGender,
            },
            include: {
                renter: true,
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
        }) as RentPlan;

        return newRentPlan;
    }
}