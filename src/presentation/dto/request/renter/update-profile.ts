import { Renter, Gender } from '../../../../domain/entity/renter';

export class RenterUpdateProfileRequest {
    constructor (
        public fullname: string,
        public phone_number: string,
        public gender: Gender,
    ) {}

    public static toEntity(data: RenterUpdateProfileRequest): Renter {
        return new Renter(
            0,
            "",
            "",
            data.fullname,
            data.phone_number,
            data.gender,
        );
    }
}