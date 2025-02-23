import { RentPlan } from "../../../../domain/entity/rent-plan";
import { GetCityHallPricingResponse } from "./get-cityhall-pricing";
import { GetGuesthouseRoomPricingResponse } from "./get-guesthouse-room-pricing";

export class GetRentPlanResponse {
    constructor(
        public id: number,
        public renter_id: number,
        public slot: number,
        public start_date: Date,
        public end_date: Date,
        public renter_gender: string,
        public city_hall_pricing: GetCityHallPricingResponse | null,
        public guesthouse_room_pricing: GetGuesthouseRoomPricingResponse | null,
        public created_at: Date,
        public updated_at: Date,
    ) {}

    public static fromEntity(rentPlan: RentPlan): GetRentPlanResponse {
        return new GetRentPlanResponse(
            rentPlan.id,
            rentPlan.renterId,
            rentPlan.slot,
            rentPlan.startDate,
            rentPlan.endDate,
            rentPlan.renterGender,
            GetCityHallPricingResponse.fromEntity(rentPlan.cityHallPricing),
            GetGuesthouseRoomPricingResponse.fromEntity(rentPlan.guesthouseRoomPricing),
            rentPlan.createdAt,
            rentPlan.updatedAt
        );
    }
}