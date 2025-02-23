import { GuesthouseRoom } from './guesthouse-room';

export class GuesthouseRoomPricing {
    constructor(
        public id: number = 0,
        public guesthouseRoomId: number = 0,
        public retributionType: string = '',
        public pricePerDay: number = 0,
        public isActive: boolean = true,
        public guesthouseRoom: GuesthouseRoom = new GuesthouseRoom(),
    ) {}
}