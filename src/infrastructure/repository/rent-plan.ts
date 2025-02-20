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
}