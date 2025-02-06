import { CityHall, CityHallStatus } from "../../../../domain/entity/city-hall";
import { CityHallPricingRequest } from "./pricing";

export class UpdateCityHallRequest {
    constructor (
        public name: string,
        public description: string,
        public area_m2: number,
        public people_capacity: number,
        public address: string,
        public latitude: number,
        public longitude: number,
        public status: CityHallStatus,
        public contact_person: string,
        public pricing: CityHallPricingRequest[],
    ) {}

    public static toEntity(data: UpdateCityHallRequest): CityHall {
        return new CityHall(
            0,
            data.name,
            data.description,
            data.area_m2,
            data.people_capacity,
            data.address,
            data.latitude,
            data.longitude,
            data.status,
            data.contact_person,
            [],
            data.pricing.map((pricing) => CityHallPricingRequest.toEntity(pricing)),
        );
    }
}