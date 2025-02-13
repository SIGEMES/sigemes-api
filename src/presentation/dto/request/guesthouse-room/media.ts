import { GuesthouseRoomMedia } from "../../../../domain/entity/guesthouse-room-media";

export class GuesthouseRoomMediaRequest {
    constructor(
        public id: number = 0,
        public url: string,
    ) { }

    public static toEntity(data: GuesthouseRoomMediaRequest): GuesthouseRoomMedia {
        return new GuesthouseRoomMedia(
            data.id,
            0,
            data.url,
        );
    }
}