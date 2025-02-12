import { GuesthouseRoomPricing } from "../../../../domain/entity/guesthouse-room-pricing";

export class GetGuesthouseRoomPricingResponse {
    constructor(
        public id: number,
        public price_per_day: number,
        public is_active: boolean,
    ) {}

    public static fromEntity(guesthouseRoomPricing: GuesthouseRoomPricing): GetGuesthouseRoomPricingResponse {
        return new GetGuesthouseRoomPricingResponse(
            guesthouseRoomPricing.id,
            guesthouseRoomPricing.pricePerDay,
            guesthouseRoomPricing.isActive,
        );
    }
}