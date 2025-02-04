import { CityHallMedia } from '@prisma/client';
import { CityHall } from '../../entity/city-hall';
import { CityHallPricing } from '../../entity/city-hall-pricing';

export interface CityHallRepositoryInterface {
    getAllCityHalls(): Promise<CityHall[]>;
    getCityHallById(id: number): Promise<CityHall|null>;
    createCityHall(cityHall: CityHall): Promise<CityHall>;
}