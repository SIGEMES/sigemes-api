import { Rent, Gender } from "../../../../domain/entity/rent";

export class CreateRentRequest {
    constructor (
        public guesthouse_room_pricing_id: number | null,
        public city_hall_pricing_id: number | null,
        public slot: number,
        public start_date: Date,
        public end_date: Date,
        public renter_gender: Gender,
    ) {}

    public static toEntity(data: CreateRentRequest): Rent {
        return new Rent(
            0,
            0,
            data.guesthouse_room_pricing_id,
            data.city_hall_pricing_id,
            data.slot,
            data.start_date,
            data.end_date,
            data.renter_gender,
            null,
            null,
            'pending',
            new Date(),
            new Date(),
        );
    }
}