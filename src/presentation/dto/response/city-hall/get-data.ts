import { CityHall } from "../../../../domain/entity/city-hall";
import { GetCityHallMediaResponse } from "./get-data-media";
import { GetCityHallPricingResponse } from "./get-data-pricing";

export class GetCityHallDataResponse {
    constructor(
        public id: number,
        public name: string,
        public description: string,
        public area_m2: number,
        public people_capacity: number,
        public address: string,
        public latitude: number,
        public longitude: number,
        public status: string,
        public contact_person: string,
        public media: GetCityHallMediaResponse[],
        public pricing: GetCityHallPricingResponse[],
    ) {}

    public static fromEntity(cityHall: CityHall): GetCityHallDataResponse {
        return new GetCityHallDataResponse(
            cityHall.id,
            cityHall.name,
            cityHall.description,
            cityHall.areaM2,
            cityHall.peopleCapacity,
            cityHall.address,
            cityHall.latitude,
            cityHall.longitude,
            cityHall.status,
            cityHall.contactPerson,
            cityHall.cityHallMedia.map(GetCityHallMediaResponse.fromEntity),
            cityHall.cityHallPricing.map(GetCityHallPricingResponse.fromEntity),
        );
    }
}