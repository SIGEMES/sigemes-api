import { CityHallMedia } from '@prisma/client';
import { CityHall } from '../../entity/city-hall';
import { CityHallPricing } from '../../entity/city-hall-pricing';

export interface CityHallRepositoryInterface {
    getAllCityHalls(): Promise<CityHall[]>;
    getCityHallById(id: number, transaction?: any): Promise<CityHall|null>;
    getCityHallMediaById(id: number, transaction?: any): Promise<CityHallMedia|null>;
    createCityHall(cityHall: CityHall, transaction?: any): Promise<CityHall>;
    createCityHallMedia(cityHallMedia: CityHallMedia[], transaction?: any): Promise<CityHallMedia[]>;
    createCityHallPricing(cityHallPricing: CityHallPricing[], transaction?: any): Promise<CityHallPricing[]>;
    updateCityHallOnly(id: number, cityHall: CityHall, transaction?: any): Promise<CityHall>;
    updateCityHallPricing(cityHallPricing: CityHallPricing, transaction?: any): Promise<CityHallPricing>;
    deleteCityHall(id: number, transaction?: any): Promise<CityHall>;
    deleteCityHallPricing(id: number, transaction?: any): Promise<CityHallPricing>;
    deleteCityHallMedia(id: number, transaction?: any): Promise<CityHallMedia>;
}