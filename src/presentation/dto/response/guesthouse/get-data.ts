import { Guesthouse } from "../../../../domain/entity/guesthouse";
import { GetGuesthouseMediaResponse } from "./get-data-media";

export class GetGuesthouseResponse {
    constructor(
        public id: number,
        public name: string,
        public description: string,
        public facilities: string,
        public area_m2: number,
        public address: string,
        public latitude: number,
        public longitude: number,
        public contact_person: string,
        public guesthouse_media: GetGuesthouseMediaResponse[]
    ) {}

    public static fromEntity(guesthouse: Guesthouse): GetGuesthouseResponse {
        return new GetGuesthouseResponse(
            guesthouse.id,
            guesthouse.name,
            guesthouse.description,
            guesthouse.facilities,
            guesthouse.areaM2,
            guesthouse.address,
            guesthouse.latitude,
            guesthouse.longitude,
            guesthouse.contactPerson,
            guesthouse.guesthouseMedia.map((media) => GetGuesthouseMediaResponse.fromEntity(media))
        );
    }
}