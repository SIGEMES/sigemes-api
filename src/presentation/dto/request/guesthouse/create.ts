import { Guesthouse } from "../../../../domain/entity/guesthouse";

export class CreateGuesthouseRequest {
    constructor(
        public name: string,
        public description: string,
        public facilities: string,
        public area_m2: number,
        public address: string,
        public latitude: number,
        public longitude: number,
        public contact_person: string,
    ) {}

    public static toEntity(data: CreateGuesthouseRequest): Guesthouse {
        return new Guesthouse(
            0,
            data.name,
            data.description,
            data.facilities,
            data.area_m2,
            data.address,
            data.latitude,
            data.longitude,
            data.contact_person,
            [],
        );
    }
}