import { CityHallMedia } from "../../../../domain/entity/city-hall-media";

export class GetCityHallMediaResponse {
    constructor(
        public id: number,
        public url: string
    ) {}

    public static fromEntity(cityHallMedia: CityHallMedia): GetCityHallMediaResponse {
        return new GetCityHallMediaResponse(
            cityHallMedia.id,
            cityHallMedia.url
        );
    }
}