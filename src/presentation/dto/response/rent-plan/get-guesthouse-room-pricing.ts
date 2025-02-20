import { GuesthouseRoomPricing } from "../../../../domain/entity/guesthouse-room-pricing";
import { GetGuesthouseRoomResponse } from "./get-guesthouse-room";

export class GetGuesthouseRoomPricingResponse {
    constructor(
        public id: number,
        public retribution_type: string,
        public price_per_day: number,
        public is_active: boolean,
        public guesthouse_room: GetGuesthouseRoomResponse,
    ) {}

    public static fromEntity(guesthouseRoomPricing: GuesthouseRoomPricing | null): GetGuesthouseRoomPricingResponse | null {
        if (guesthouseRoomPricing === null) {
            return null;
        }
        
        return new GetGuesthouseRoomPricingResponse(
            guesthouseRoomPricing.id,
            guesthouseRoomPricing.retributionType,
            guesthouseRoomPricing.pricePerDay,
            guesthouseRoomPricing.isActive,
            GetGuesthouseRoomResponse.fromEntity(guesthouseRoomPricing.guesthouseRoom),
        );
    }
}