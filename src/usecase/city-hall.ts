import { CityHall } from "../domain/entity/city-hall";
import { ResponseError } from "../domain/error/response-error";
import { CityHallRepositoryInterface } from "../domain/interface/repository/city-hall";

export class CityHallUsecase {
    constructor(
        private cityHallRepository: CityHallRepositoryInterface
    ) {}

    public async getAllCityHalls(): Promise<CityHall[]> {
        const cityHalls: CityHall[] = await this.cityHallRepository.getAllCityHalls();

        return cityHalls;
    }
}
