import { GuesthouseRoomPricing } from "./guesthouse-room-pricing";
import { GuesthouseRoomMedia } from "./guesthouse-room-media";
import { Guesthouse } from "./guesthouse";

export type RoomType = "vip" | "standard";

export class GuesthouseRoom {
    constructor(
        public id: number = 0,
        public guesthouseId: number = 0,
        public name: string = '',
        public type: RoomType = 'standard',
        public facilities: string = '',
        public totalSlot: number = 0,
        public areaM2: number = 0,
    
        public guesthouseRoomPricing: GuesthouseRoomPricing[] = [],
        public guesthouseRoomMedia: GuesthouseRoomMedia[] = [],
        public guesthouse: Guesthouse = new Guesthouse(),
    ) {}
}