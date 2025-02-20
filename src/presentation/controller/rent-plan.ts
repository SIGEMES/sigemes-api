import { Request, Response, NextFunction } from 'express';
import { RentPlan } from '../../domain/entity/rent-plan';
import { RentPlanUsecase } from '../../usecase/rent-plan';
import { BaseSuccessResponse } from '../dto/response/base/base-success';
import { GetRentPlanResponse } from '../dto/response/rent-plan/get-rent-plan';

export class RentPlanController {
    constructor(private rentPlanUsecase: RentPlanUsecase) {}

    public async getAllRenterRentPlans(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const rentPlans: RentPlan[] = await this.rentPlanUsecase.getAllRenterRentPlans(res.locals.user.id);
            const rentPlansResponse: GetRentPlanResponse[] = rentPlans.map(rentPlan => GetRentPlanResponse.fromEntity(rentPlan));
            res.status(200).json(new BaseSuccessResponse(true, "Get all renter rent plan success", rentPlansResponse));
        } catch (error) {
            next(error);
        }
    }
}