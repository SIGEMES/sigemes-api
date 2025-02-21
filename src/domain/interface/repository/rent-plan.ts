import { RentPlan } from "../../entity/rent-plan";

export interface RentPlanRepositoryInterface {
    getAllRenterRentPlans(renterId: number): Promise<RentPlan[]>;
    getRentPlanById(renterId: number): Promise<RentPlan>;
    createRentPlan(rentPlan: RentPlan): Promise<RentPlan>;
}