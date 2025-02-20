import { RentPlan } from "../domain/entity/rent-plan";
import { ResponseError } from "../domain/error/response-error";
import { RentPlanRepositoryInterface } from "../domain/interface/repository/rent-plan";
import { DbTransactionInterface } from "../domain/interface/repository/db-transaction";

export class RentPlanUsecase {
    constructor(
        private rentPlanRepository: RentPlanRepositoryInterface,
        private dbTransaction: DbTransactionInterface,
    ) {}

    public async getAllRenterRentPlans(userId: number): Promise<RentPlan[]> {
        const rentPlans: RentPlan[] = await this.rentPlanRepository.getAllRenterRentPlans(userId);

        return rentPlans;
    }

    public async getRenterRentPlanById(renterId: number): Promise<RentPlan[]> {
        const rentPlan: RentPlan[]|null = await this.rentPlanRepository.getAllRenterRentPlans(renterId);

        if (!rentPlan) {
            throw new ResponseError("Rent plan not found", 404);
        }

        return rentPlan;
    }
}