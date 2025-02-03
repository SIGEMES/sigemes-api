import { CityHall } from '../../entity/city-hall';

export interface CityHallRepositoryInterface {
    getAllCityHalls(): Promise<CityHall[]>;
    getCityHallById(id: number): Promise<CityHall|null>;
}