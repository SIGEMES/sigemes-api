import { CityHallMedia } from "./city-hall-media";
import { CityHallPricing } from "./city-hall-pricing";

export type CityHallStatus = 'tersedia' | 'tidak_tersedia';

export class CityHall {
    constructor (
        public id: number = 0,
        public name: string = '',
        public description: string = '',
        public areaM2: number = 0,
        public peopleCapacity: number = 0,
        public address: string = '',
        public latitude: number = 0,
        public longitude: number = 0,
        public status: CityHallStatus = 'tersedia',
        public contactPerson: string = '',

        public media: CityHallMedia[] = [],
        public pricing: CityHallPricing[] = [],
    ) {}
}