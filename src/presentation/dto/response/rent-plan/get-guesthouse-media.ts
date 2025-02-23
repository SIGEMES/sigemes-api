import { GuesthouseMedia } from "../../../../domain/entity/guesthouse-media";

export class GetGuesthouseMediaResponse {
    constructor(
        public id: number,
        public url: string
    ) {}

    public static fromEntity(guesthouseMedia: GuesthouseMedia): GetGuesthouseMediaResponse {
        return new GetGuesthouseMediaResponse(
            guesthouseMedia.id,
            guesthouseMedia.url
        );
    }
}