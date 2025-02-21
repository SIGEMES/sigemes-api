import { RentPlan } from "../domain/entity/rent-plan";
import { ResponseError } from "../domain/error/response-error";
import { RentPlanRepositoryInterface } from "../domain/interface/repository/rent-plan";
import { GuesthouseRoomRepositoryInterface } from "../domain/interface/repository/guesthouse-room";
import { CityHallRepositoryInterface } from "../domain/interface/repository/city-hall";
import { DbTransactionInterface } from "../domain/interface/repository/db-transaction";
import { CityHallStatus } from "../domain/entity/city-hall";

export class RentPlanUsecase {
    constructor(
        private rentPlanRepository: RentPlanRepositoryInterface,
        private guesthouseRoomRepository: GuesthouseRoomRepositoryInterface,
        private cityHallRepository: CityHallRepositoryInterface,
        private dbTransaction: DbTransactionInterface,
    ) { }

    public async getAllRenterRentPlans(userId: number): Promise<RentPlan[]> {
        const rentPlans: RentPlan[] = await this.rentPlanRepository.getAllRenterRentPlans(userId);

        return rentPlans;
    }

    public async createRentPlan(rentPlan: RentPlan): Promise<RentPlan> {
        let createdRentPlan: RentPlan;

        if (rentPlan.guesthouseRoomPricingId) {
            const guesthouseRoomPricing = await this.guesthouseRoomRepository.getGuesthouseRoomPricingById(rentPlan.guesthouseRoomPricingId);
            if (!guesthouseRoomPricing) {
                throw new ResponseError("Guesthouse room pricing not found", 404);
            }

            if (guesthouseRoomPricing.isActive === false) {
                throw new ResponseError("Guesthouse room pricing is not available", 400);
            }

            if (guesthouseRoomPricing.guesthouseRoom.availableSlot <= rentPlan.slot) {
                throw new ResponseError("Guesthouse room available slot is not enough", 400);
            }

            createdRentPlan = await this.rentPlanRepository.createRentPlan(rentPlan);

        } else if (rentPlan.cityHallPricingId) {
            const oneWeekFromNow = new Date();
            oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);

            if (rentPlan.startDate > rentPlan.endDate) {
                throw new ResponseError("Start date must be less than end date", 400);
            }

            if (rentPlan.startDate < oneWeekFromNow) {
                throw new ResponseError("Start date must be at least 1 week from now", 400);
            }

            const cityHallPricing = await this.cityHallRepository.getCityHallPricingById(rentPlan.cityHallPricingId);
            if (!cityHallPricing) {
                throw new ResponseError("City hall pricing not found", 404);
            }

            if (cityHallPricing.isActive === false) {
                throw new ResponseError("City hall pricing is not available", 400);
            }

            createdRentPlan = await this.rentPlanRepository.createRentPlan(rentPlan);
            
        } else {
            throw new ResponseError("Bad request", 400);
        }

        return createdRentPlan;
    }
}