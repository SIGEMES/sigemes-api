import { Request, Response, NextFunction } from 'express';
import { RenterUsecase } from '../../usecase/renter';
import { Renter } from '../../domain/entity/renter';
import { RenterLoginResponse } from '../dto/response/renter-login';
import { BaseSuccessResponse } from '../dto/response/base-success';

export class RenterController {
    constructor(private renterUsecase: RenterUsecase) {}

    async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const renter: Renter = await this.renterUsecase.login(req.body);
            const renterResponse: RenterLoginResponse = RenterLoginResponse.fromEntity(renter);
            res.status(200).json(new BaseSuccessResponse(true, "Login success", renterResponse));
        } catch (error) {
            next(error);
        }
    }
}