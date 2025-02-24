import { Request, Response, NextFunction } from 'express';
import { Rent } from '../../domain/entity/rent';
import { RentUsecase } from '../../usecase/rent';
import { BaseSuccessResponse } from '../dto/response/base/base-success';
import { GetRentResponse } from '../dto/response/rent/get-rent';
import { RentValidation } from '../validation/rent';

export class RentController {
    constructor(private rentUsecase: RentUsecase) {}

    public async getAllRents(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const rents: Rent[] = await this.rentUsecase.getAllRents(res.locals.user.id, res.locals.user.role);
            const rentsResponse: GetRentResponse[] = rents.map(rent => GetRentResponse.fromEntity(rent));
            res.status(200).json(new BaseSuccessResponse(true, "Get all rents success", rentsResponse));
        } catch (error) {
            next(error);
        }
    }

    public async getRentById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id: rentId } = RentValidation.id.parse({ id: Number(req.params.id) });
            const rent: Rent = await this.rentUsecase.getRentById(rentId, res.locals.user.id, res.locals.user.role);
            const rentResponse: GetRentResponse = GetRentResponse.fromEntity(rent);
            res.status(200).json(new BaseSuccessResponse(true, "Get rent success", rentResponse));
        } catch (error) {
            next(error);
        }
    }
}

