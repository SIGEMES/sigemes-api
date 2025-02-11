import { GuesthouseRoomPricing } from "./guesthouse-room-pricing";
import { GuesthouseRoomMedia } from "./guesthouse-room-media";

export type RoomType = "vip" | "standard";
export type Status = "tersedia" | "tidak_tersedia";

export class GuesthouseRoom {
    constructor(
        public id: number = 0,
        public guesthouseId: number = 0,
        public name: string = '',
        public type: string = '',
        public facilities: string = '',
        public availableSlot: number = 0,
        public totalSlot: number = 0,
        public areaM2: number = 0,
        public status: Status = 'tersedia',
    
        public guesthouseRoomPricing: GuesthouseRoomPricing[] = [],
        public guesthouseRoomMedia: GuesthouseRoomMedia[] = [],
    ) {}
}