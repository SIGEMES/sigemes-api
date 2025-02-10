export class GuesthouseRoomPricing {
    constructor(
        public id: number = 0,
        public guesthouseRoomId: number = 0,
        public retributionType: number = 0,
        public pricePerDay: number = 0,
        public isActive: boolean = true,
    ) {}
}