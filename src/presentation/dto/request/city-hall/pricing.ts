import { CityHallPricing } from "../../../../domain/entity/city-hall-pricing";

export class CityHallPricingRequest {
    constructor(
        public activity_type: string,
        public facilities: string,
        public price_per_day: number,
    ) { }

    public static toEntity(data: CityHallPricingRequest): CityHallPricing {
        return new CityHallPricing(
            0,
            0,
            data.activity_type,
            data.facilities,
            data.price_per_day,
        );
    }
}