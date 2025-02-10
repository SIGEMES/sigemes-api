import { GuesthouseMedia } from "./guesthouse-media";
import { GuesthouseRoom } from "./guesthouse-room";

export class Guesthouse {
    constructor(
        public id: number = 0,
        public name: string = '',
        public description: string = '',
        public facilities: string = '',
        public areaM2: number = 0,
        public address: string = '',
        public latitude: number = 0,
        public longitude: number = 0,
        public contactPerson: string = '',

        public guesthouseMedia: GuesthouseMedia[] = [],
        public guesthouseRoom: GuesthouseRoom[] = [],
    ) {}
}