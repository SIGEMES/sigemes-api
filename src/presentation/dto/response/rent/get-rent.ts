import { Rent } from "../../../../domain/entity/rent";
import { GetCityHallPricingResponse } from "./get-cityhall-pricing";
import { GetGuesthouseRoomPricingResponse } from "./get-guesthouse-room-pricing";
import { GetPaymentResponse } from "./get-payment";
import { GetRenterResponse } from "./get-renter";

export class GetRentResponse {
    constructor(
        public id: number,
        public renter_id: number,
        public slot: number,
        public start_date: Date,
        public end_date: Date,
        public renter_gender: string,
        public check_in: Date | null,
        public check_out: Date | null,
        public rent_status: string,
        public city_hall_pricing: GetCityHallPricingResponse | undefined,
        public guesthouse_room_pricing: GetGuesthouseRoomPricingResponse | undefined,
        public payment: GetPaymentResponse | null,
        public renter: GetRenterResponse | null,
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
            rent.status,
            GetCityHallPricingResponse.fromEntity(rent.cityHallPricing),
            GetGuesthouseRoomPricingResponse.fromEntity(rent.guesthouseRoomPricing),
            GetPaymentResponse.fromEntity(rent.payment),
            GetRenterResponse.fromEntity(rent.renter),
            rent.createdAt,
            rent.updatedAt
        );
    }
}
