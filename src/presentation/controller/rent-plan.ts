import { Request, Response, NextFunction } from 'express';
import { RentPlan } from '../../domain/entity/rent-plan';
import { RentPlanUsecase } from '../../usecase/rent-plan';
import { BaseSuccessResponse } from '../dto/response/base/base-success';
import { GetRentPlanResponse } from '../dto/response/rent-plan/get-rent-plan';
import { RentPlanValidation } from '../validation/rent-plan';
import { CreateRentPlanRequest } from '../dto/request/rent-plan/create';
import { UpdateRentPlanRequest } from '../dto/request/rent-plan/update';

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

    public async createRentPlan(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const startDate = new Date(req.body.start_date);
            const endDate = new Date(req.body.end_date);
            req.body.start_date = startDate;
            req.body.end_date = endDate
            const validatedData: CreateRentPlanRequest = RentPlanValidation.createRentPlan.parse(req.body);
            const rentPlanEntity = CreateRentPlanRequest.toEntity(validatedData);
            rentPlanEntity.renterId = res.locals.user.id;
            const rentPlan: RentPlan = await this.rentPlanUsecase.createRentPlan(rentPlanEntity);
            const rentPlanResponse: GetRentPlanResponse = GetRentPlanResponse.fromEntity(rentPlan);
            res.status(201).json(new BaseSuccessResponse(true, "Create rent plan success", rentPlanResponse));
        } catch (error) {
            next(error);
        }
    }

    public async updateRentPlan(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = RentPlanValidation.id.parse({ id: Number(req.params.id) });

            const startDate = new Date(req.body.start_date);
            const endDate = new Date(req.body.end_date);
            req.body.start_date = startDate;
            req.body.end_date = endDate

            const validatedData: UpdateRentPlanRequest = RentPlanValidation.updateRentPlan.parse(req.body);
            const rentPlanEntity = UpdateRentPlanRequest.toEntity(validatedData);
            rentPlanEntity.renterId = res.locals.user.id;
            rentPlanEntity.id = id;

            const rentPlan: RentPlan = await this.rentPlanUsecase.updateRentPlan(rentPlanEntity);
            const rentPlanResponse: GetRentPlanResponse = GetRentPlanResponse.fromEntity(rentPlan);
            res.status(200).json(new BaseSuccessResponse(true, "Update rent plan success", rentPlanResponse));
        } catch (error) {
            next(error);
        }
    }

    public async deleteRentPlan(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = RentPlanValidation.id.parse({ id: Number(req.params.id) });
            await this.rentPlanUsecase.deleteRentPlan(id, res.locals.user.id);
            res.status(200).json(new BaseSuccessResponse(true, "Delete rent plan success"));
        } catch (error) {
            next(error);
        }
    }
}