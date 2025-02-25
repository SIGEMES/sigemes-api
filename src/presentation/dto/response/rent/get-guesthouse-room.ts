import { GuesthouseRoom } from "../../../../domain/entity/guesthouse-room";
import { GetGuesthouseRoomMediaResponse } from "./get-guesthouse-room-media";
import { GetGuesthouseResponse } from "./get-guesthouse";

export class GetGuesthouseRoomResponse {
    constructor(
        public id: number,
        public guesthouse_id: number,
        public name: string,
        public type: string,
        public facilities: string,
        public available_slot: number,
        public total_slot: number,
        public area_m2: number,
        public status: string,
        public media: GetGuesthouseRoomMediaResponse[],
        public guesthouse: GetGuesthouseResponse,
    ) {}

    public static fromEntity(guesthouseRoom: GuesthouseRoom): GetGuesthouseRoomResponse {
        return new GetGuesthouseRoomResponse(
            guesthouseRoom.id,
            guesthouseRoom.guesthouseId,
            guesthouseRoom.name,
            guesthouseRoom.type,
            guesthouseRoom.facilities,
            guesthouseRoom.availableSlot,
            guesthouseRoom.totalSlot,
            guesthouseRoom.areaM2,
            guesthouseRoom.status,
            guesthouseRoom.guesthouseRoomMedia.map(GetGuesthouseRoomMediaResponse.fromEntity),
            GetGuesthouseResponse.fromEntity(guesthouseRoom.guesthouse),
        );
    }
}