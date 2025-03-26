import { GuesthouseRoomPricing } from "./guesthouse-room-pricing";
import { CityHallPricing } from "./city-hall-pricing";
import { Payment } from "./payment";
import { Renter } from "./renter";

export type RentStatus = 'pending' | 'dikonfirmasi' | 'selesai' | 'dibatalkan';
export type Gender = "laki_laki" | "perempuan";
export type RentType = 'guesthouse' | 'city_hall';
export type CheckinCheckoutStatus = 'belum_checkin' | 'sudah_checkin' | 'belum_checkout' | 'sudah_checkout';

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
        public checkIn: Date | null = null,
        public checkOut: Date | null = null,
        public status: RentStatus = 'pending',
        public createdAt: Date = new Date(),
        public updatedAt: Date = new Date(),

        public renter: Renter | null = null,
        public guesthouseRoomPricing: GuesthouseRoomPricing | null = null,
        public cityHallPricing: CityHallPricing | null = null,
        public payment: Payment | null = null,
    ) {}
}

export class RentFilter {
    constructor (
        public page: number = 1,
        public limit: number = 10,
        public search: string | null = null,
        public type: RentType | null = null,
        public status: RentStatus | null = null,
        public checkinCheckoutStatus: CheckinCheckoutStatus | null = null,
        public startDate: Date | null = null,
        public endDate: Date | null = null,
    ) {}
}