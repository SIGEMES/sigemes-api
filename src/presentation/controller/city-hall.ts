import { Request, Response, NextFunction } from 'express';
import { CityHall } from '../../domain/entity/city-hall';
import { CityHallUsecase } from '../../usecase/city-hall';
import { BaseSuccessResponse } from '../dto/response/base/base-success';
import { GetCityHallDataResponse } from '../dto/response/city-hall/get-data';

export class CityHallController {
    constructor(private cityHallUsecase: CityHallUsecase) {}

    public async getAllCityHalls(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const cityHalls: CityHall[] = await this.cityHallUsecase.getAllCityHalls();
            const cityHallsResponse: GetCityHallDataResponse[] = cityHalls.map(cityHall => GetCityHallDataResponse.fromEntity(cityHall));
            res.status(200).json(new BaseSuccessResponse(true, "Get all city hall success", cityHallsResponse));
        } catch (error) {
            next(error);
        }
    }
}
