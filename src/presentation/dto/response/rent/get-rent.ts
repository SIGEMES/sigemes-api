import { Rent } from "../../../../domain/entity/rent";
import { GetCityHallPricingResponse } from "./get-cityhall-pricing";
import { GetGuesthouseRoomPricingResponse } from "./get-guesthouse-room-pricing";

export class GetRentResponse {
    constructor(
        public id: number,
        public renter_id: number,
        public slot: number,
        public start_date: Date,
        public end_date: Date,
        public renter_gender: string,
        public check_in: Date,
        public check_out: Date,
        public rent_status: string,
        public city_hall_pricing: GetCityHallPricingResponse | null,
        public guesthouse_room_pricing: GetGuesthouseRoomPricingResponse | null,
        public created_at: Date,
        public updated_at: Date,
    ) {}

    public static fromEntity(rent: Rent): GetRentResponse {
        return new GetRentResponse(
            rent.id,
            rent.renterId,
            rent.slot,
            rent.startDate,
            rent.endDate,
            rent.renterGender,
            rent.checkIn,
            rent.checkOut,
            rent.rentStatus,
            GetCityHallPricingResponse.fromEntity(rent.cityHallPricing),
            GetGuesthouseRoomPricingResponse.fromEntity(rent.guesthouseRoomPricing),
            rent.createdAt,
            rent.updatedAt
        );
    }
}