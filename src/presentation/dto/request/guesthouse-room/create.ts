import { GuesthouseRoom, RoomType, Status } from "../../../../domain/entity/guesthouse-room";
import { GuesthouseRoomPricingRequest } from "./pricing";

export class CreateGuesthouseRoomRequest {
    constructor(
        public name: string,
        public type: RoomType,
        public facilities: string,
        public available_slot: number,
        public total_slot: number,
        public area_m2: number,
        public status: Status,
        public room_pricing: GuesthouseRoomPricingRequest[],
    ) { }

    public static toEntity(data: CreateGuesthouseRoomRequest): GuesthouseRoom {
        return new GuesthouseRoom(
            0,
            0,
            data.name,
            data.type,
            data.facilities,
            data.available_slot,
            data.total_slot,
            data.area_m2,
            data.status,
            data.room_pricing.map(pricing => GuesthouseRoomPricingRequest.toEntity(pricing)),
            [],
        );
    }

}