import { CityHallMedia } from "../../../../domain/entity/city-hall-media";

export class CityHallMediaRequest {
    constructor(
        public id: number = 0,
        public url: string,
    ) { }

    public static toEntity(data: CityHallMediaRequest): CityHallMedia {
        return new CityHallMedia(
            data.id,
            0,
            data.url,
        );
    }
}