import { Renter, Gender } from '../../../../domain/entity/renter';

export class RenterRegisterRequest {
    constructor (
        public email: string,
        public password: string,
        public fullname: string,
        public phone_number: string,
        public gender: Gender,
    ) {}

    public static toEntity(data: RenterRegisterRequest): Renter {
        return new Renter(
            0,
            data.email,
            data.password,
            data.fullname,
            data.phone_number,
            data.gender,
        );
    }
}