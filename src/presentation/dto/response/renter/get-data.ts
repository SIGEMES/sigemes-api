import { Renter } from '../../../../domain/entity/renter';

export class RenterGetDataResponse {
    constructor (
        public id: number,
        public email: string,
        public fullname: string,
        public phone_number: string,
        public gender: string,
        public profile_picture: string | null,
        public email_verified: boolean,
    ) {}

    public static fromEntity(renter: Renter): RenterGetDataResponse {
        return new RenterGetDataResponse(
            renter.id,
            renter.email,
            renter.fullname,
            renter.phoneNumber,
            renter.gender,
            renter.profilePicture,
            renter.emailVerified,
        );
    }
}