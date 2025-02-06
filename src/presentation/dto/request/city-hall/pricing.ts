import { CityHallPricing } from "../../../../domain/entity/city-hall-pricing";

export class CityHallPricingRequest {
    constructor(
        public id: number,
        public activity_type: string,
        public facilities: string,
        public price_per_day: number,
        public is_active: boolean,
    ) { }

    public static toEntity(data: CityHallPricingRequest): CityHallPricing {
        return new CityHallPricing(
            data.id,
            0,
            data.activity_type,
            data.facilities,
            data.price_per_day,
            data.is_active,
        );
    }
}