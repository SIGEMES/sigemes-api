import { GuesthouseRoomPricing } from "../../../../domain/entity/guesthouse-room-pricing";

export class GuesthouseRoomPricingRequest {
    constructor(
        public id: number = 0,
        public retribution_type: string,
        public price_per_day: number,
        public is_available: boolean,
    ) { }

    public static toEntity(data: GuesthouseRoomPricingRequest): GuesthouseRoomPricing {
        return new GuesthouseRoomPricing(
            data.id,
            0,
            data.retribution_type,
            data.price_per_day,
            data.is_available,
        );
    }
}