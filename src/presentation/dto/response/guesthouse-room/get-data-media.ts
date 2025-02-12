import { GuesthouseRoomMedia } from "../../../../domain/entity/guesthouse-room-media";

export class GetGuesthouseRoomMediaResponse {
    constructor(
        public id: number,
        public url: string
    ) {}

    public static fromEntity(guesthouseRoomMedia: GuesthouseRoomMedia): GetGuesthouseRoomMediaResponse {
        return new GetGuesthouseRoomMediaResponse(
            guesthouseRoomMedia.id,
            guesthouseRoomMedia.url
        );
    }
}