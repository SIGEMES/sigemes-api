import { CityHallPricing } from "../../../../domain/entity/city-hall-pricing";
import { GetCityHallResponse } from "./get-cityhall";

export class GetCityHallPricingResponse {
    constructor(
        public id: number,
        public activity_type: string,
        public facilities: string,
        public price_per_day: number,
        public is_active: boolean,
        public city_hall: GetCityHallResponse,
    ) {}

    public static fromEntity(cityHallPricing: CityHallPricing | null): GetCityHallPricingResponse | null {
        if (cityHallPricing === null) {
            return null;
        } else {
            return new GetCityHallPricingResponse(
                cityHallPricing.id,
                cityHallPricing.activityType,
                cityHallPricing.facilities,
                cityHallPricing.pricePerDay,
                cityHallPricing.isActive,
                GetCityHallResponse.fromEntity(cityHallPricing.cityHall),
            );
        }
    }
}