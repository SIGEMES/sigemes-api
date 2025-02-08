import { CityHallPricing } from "../../../../domain/entity/city-hall-pricing";

export class GetCityHallPricingResponse {
    constructor(
        public id: number,
        public activity_type: string,
        public facilities: string,
        public price_per_day: number,
        public is_active: boolean,
    ) {}

    public static fromEntity(cityHallPricing: CityHallPricing): GetCityHallPricingResponse {
        return new GetCityHallPricingResponse(
            cityHallPricing.id,
            cityHallPricing.activityType,
            cityHallPricing.facilities,
            cityHallPricing.pricePerDay,
            cityHallPricing.isActive,
        );
    }
}