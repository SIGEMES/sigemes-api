export class CityHallPricing {
    constructor (
        public id: number = 0,
        public cityHallId: number = 0,
        public activityType: string = '',
        public facilities: string = '',
        public pricePerDay: number = 0,
        public isActive: boolean = true,
    ) {}
}