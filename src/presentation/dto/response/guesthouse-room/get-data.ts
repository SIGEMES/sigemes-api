import { GuesthouseRoom } from "../../../../domain/entity/guesthouse-room";
import { GetGuesthouseRoomMediaResponse } from "./get-data-media";
import { GetGuesthouseRoomPricingResponse } from "./get-data-pricing";

export class GetGuesthouseRoomDataResponse {
    constructor(
        public id: number,
        public guesthouse_id: number,
        public name: string,
        public type: string,
        public facilities: string,
        public total_slot: number,
        public available_slot: number,
        public area_m2: number,

        public media: GetGuesthouseRoomMediaResponse[],
        public pricing: GetGuesthouseRoomPricingResponse[],
    ) {}

    public static fromEntity(guesthouseRoom: GuesthouseRoom): GetGuesthouseRoomDataResponse {
        return new GetGuesthouseRoomDataResponse(
            guesthouseRoom.id,
            guesthouseRoom.guesthouseId,
            guesthouseRoom.name,
            guesthouseRoom.type,
            guesthouseRoom.facilities,
            guesthouseRoom.totalSlot,
            guesthouseRoom.availableSlot,
            guesthouseRoom.areaM2,
            guesthouseRoom.guesthouseRoomMedia.map(GetGuesthouseRoomMediaResponse.fromEntity),
            guesthouseRoom.guesthouseRoomPricing.map(GetGuesthouseRoomPricingResponse.fromEntity),
        );
    }
}