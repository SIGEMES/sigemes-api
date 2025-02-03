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

    public async getCityHallById(id: number): Promise<CityHall> {
        const cityHall: CityHall|null = await this.cityHallRepository.getCityHallById(id);

        if (!cityHall) {
            throw new ResponseError("City hall not found", 404);
        }

        return cityHall;
    }
}
