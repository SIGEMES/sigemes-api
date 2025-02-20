import { GuesthouseRoomPricing } from './guesthouse-room-pricing';
import { CityHallPricing } from './city-hall-pricing';
// import { Renter } from './renter';

export type Gender = 'laki_laki' | 'perempuan';

export class RentPlan {
    constructor (
        public id: number = 0,
        public renterId: number = 0,
        public guesthouseRoomPricingId: number | null = null,
        public cityHallPricingId: number | null = null,
        public slot: number = 0,
        public startDate: Date = new Date(),
        public endDate: Date = new Date(),
        public renterGender: Gender = 'laki_laki',
        public createdAt: Date = new Date(),
        public updatedAt: Date = new Date(),

        public guesthouseRoomPricing: GuesthouseRoomPricing | null = null,
        public cityHallPricing: CityHallPricing | null = null,
    ) {}
}