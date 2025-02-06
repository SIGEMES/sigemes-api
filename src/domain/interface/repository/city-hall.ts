import { CityHallMedia } from '@prisma/client';
import { CityHall } from '../../entity/city-hall';
import { CityHallPricing } from '../../entity/city-hall-pricing';

export interface CityHallRepositoryInterface {
    getAllCityHalls(): Promise<CityHall[]>;
    getCityHallById(id: number): Promise<CityHall|null>;
    getCityHallMediaById(id: number): Promise<CityHallMedia|null>;
    createCityHall(cityHall: CityHall): Promise<CityHall>;
    createCityHallMedia(cityHallMedia: CityHallMedia[]): Promise<CityHallMedia[]>;
    createCityHallPricing(cityHallPricing: CityHallPricing[]): Promise<CityHallPricing[]>;
    updateCityHallOnly(id: number, cityHall: CityHall): Promise<CityHall>;
    updateCityHallPricing(cityHallPricing: CityHallPricing): Promise<CityHallPricing>;
    deleteCityHallPricing(id: number): Promise<CityHallPricing>;
    deleteCityHallMedia(id: number): Promise<CityHallMedia>;
}