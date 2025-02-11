import { GuesthouseMedia } from "../../../../domain/entity/guesthouse-media";

export class GuesthouseMediaRequest {
    constructor(
        public id: number = 0,
        public url: string,
    ) { }

    public static toEntity(data: GuesthouseMediaRequest): GuesthouseMedia {
        return new GuesthouseMedia(
            data.id,
            0,
            data.url,
        );
    }
}