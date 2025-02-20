import { RentPlan } from "../../entity/rent-plan";

export interface RentPlanRepositoryInterface {
    getAllRenterRentPlans(renterId: number): Promise<RentPlan[]>;
}