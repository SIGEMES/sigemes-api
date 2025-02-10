import { Request, Response, NextFunction } from 'express';
import { Guesthouse } from '../../domain/entity/guesthouse';
import { GuesthouseMedia } from '../../domain/entity/guesthouse-media';
import { GuesthouseUsecase } from '../../usecase/guesthouse';
import { BaseSuccessResponse } from '../dto/response/base/base-success';
import { GetGuesthouseResponse } from '../dto/response/guesthouse/get-data';
import { GuesthouseValidation } from '../validation/guesthouse';
import { File } from '../../domain/interface/library/file';

export class GuesthouseController {
    constructor(private guesthouseUsecase: GuesthouseUsecase) {}

    public async getAllGuesthouses(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const guesthouses: Guesthouse[] = await this.guesthouseUsecase.getAllGuesthouses();
            const guesthousesResponse: GetGuesthouseResponse[] = guesthouses.map(guesthouse => GetGuesthouseResponse.fromEntity(guesthouse));
            res.status(200).json(new BaseSuccessResponse(true, "Get all guesthouse success", guesthousesResponse));
        } catch (error) {
            next(error);
        }
    }

    public async getGuesthouseById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = GuesthouseValidation.id.parse({ id: Number(req.params.id)});
            const guesthouse: Guesthouse = await this.guesthouseUsecase.getGuesthouseById(id);
            const guesthouseResponse: GetGuesthouseResponse = GetGuesthouseResponse.fromEntity(guesthouse);
            res.status(200).json(new BaseSuccessResponse(true, "Get guesthouse success", guesthouseResponse));
        } catch (error) {
            next(error);
        }
    }
}