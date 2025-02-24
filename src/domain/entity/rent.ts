import { GuesthouseRoomPricing } from "./guesthouse-room-pricing";
import { CityHallPricing } from "./city-hall-pricing";

export type RentStatus = 'pending' | 'dikonfirmasi' | 'selesai' | 'dibatalkan';
export type Gender = "laki_laki" | "perempuan";

export class Rent {
    constructor (
        public id: number = 0,
        public renterId: number = 0,
        public guesthouseRoomPricingId: number | null = null,
        public cityHallPricingId: number | null = null,
        public slot: number = 0,
        public startDate: Date = new Date(),
        public endDate: Date = new Date(),
        public renterGender: Gender = 'laki_laki',
        public checkIn: Date = new Date(),
        public checkOut: Date = new Date(),
        public rentStatus: RentStatus = 'pending',
        public createdAt: Date = new Date(),
        public updatedAt: Date = new Date(),

        public guesthouseRoomPricing: GuesthouseRoomPricing | null = null,
        public cityHallPricing: CityHallPricing | null = null,
    ) {}
}