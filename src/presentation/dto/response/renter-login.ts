import { Renter } from '../../../domain/entity/renter';

export class RenterLoginResponse {
    constructor (
        public id: number,
        public email: string,
        public fullname: string,
        public phone_number: string,
        public gender: string,
        public profile_picture: string | null,
        public email_verified: boolean,
        public token: string,
    ) {}

    static fromEntity(renter: Renter): RenterLoginResponse {
        return new RenterLoginResponse(
            renter.id,
            renter.email,
            renter.fullname,
            renter.phoneNumber,
            renter.gender,
            renter.profilePicture,
            renter.emailVerified,
            renter.token as string,
        );
    }
}