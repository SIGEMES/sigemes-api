import { Request, Response, NextFunction } from 'express';
import { Rent } from '../../domain/entity/rent';
import { RentUsecase } from '../../usecase/rent';
import { BaseSuccessResponse } from '../dto/response/base/base-success';
import { GetRentResponse } from '../dto/response/rent/get-rent';
import { RentValidation } from '../validation/rent';
import { CreateRentRequest } from '../dto/request/rent/create';

export class RentController {
    constructor(private rentUsecase: RentUsecase) { }

    public async getAllRents(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const rents: Rent[] = await this.rentUsecase.getAllRents(res.locals.user.id, res.locals.user.role);
            const rentsResponse: GetRentResponse[] = rents.map(rent => GetRentResponse.fromEntity(rent));
            res.status(200).json(new BaseSuccessResponse(true, "Get all rents success", rentsResponse.map(rent => rent.toJSON())));
        } catch (error) {
            next(error);
        }
    }

    public async getRentById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id: rentId } = RentValidation.id.parse({ id: Number(req.params.id) });
            const rent: Rent = await this.rentUsecase.getRentById(rentId, res.locals.user.id, res.locals.user.role);
            const rentResponse: GetRentResponse = GetRentResponse.fromEntity(rent);
            res.status(200).json(new BaseSuccessResponse(true, "Get rent success", rentResponse.toJSON()));
        } catch (error) {
            next(error);
        }
    }

    public async createRent(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const startDate = new Date(req.body.start_date);
            const endDate = new Date(req.body.end_date);
            req.body.start_date = startDate;
            req.body.end_date = endDate
            const validatedData: CreateRentRequest = RentValidation.create.parse(req.body);
            const rentEntity = CreateRentRequest.toEntity(validatedData);
            rentEntity.renterId = res.locals.user.id;
            const rent: Rent = await this.rentUsecase.createRent(rentEntity);
            const rentResponse: GetRentResponse = GetRentResponse.fromEntity(rent);
            res.status(201).json(new BaseSuccessResponse(true, "Create rent plan success", rentResponse.toJSON()));
        } catch (error) {
            next(error);
        }
    }

    public async cancelRent(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id: rentId } = RentValidation.id.parse({ id: Number(req.params.id) });
            const rent: Rent = await this.rentUsecase.cancelRent(rentId, res.locals.user.id, res.locals.user.role);
            const rentResponse: GetRentResponse = GetRentResponse.fromEntity(rent);
            res.status(200).json(new BaseSuccessResponse(true, "Cancel rent success", rentResponse.toJSON()));
        } catch (error) {
            next(error);
        }
    }

    public async checkInRent(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id: rentId } = RentValidation.id.parse({ id: Number(req.params.id) });
            const rent: Rent = await this.rentUsecase.checkInRent(rentId);
            const rentResponse: GetRentResponse = GetRentResponse.fromEntity(rent);
            res.status(200).json(new BaseSuccessResponse(true, "Check in rent success", rentResponse.toJSON()));
        } catch (error) {
            next(error);
        }
    }

    public async checkOutRent(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id: rentId } = RentValidation.id.parse({ id: Number(req.params.id) });
            const rent: Rent = await this.rentUsecase.checkOutRent(rentId);
            const rentResponse: GetRentResponse = GetRentResponse.fromEntity(rent);
            res.status(200).json(new BaseSuccessResponse(true, "Check out rent success", rentResponse.toJSON()));
        } catch (error) {
            next(error);
        }
    }
}

