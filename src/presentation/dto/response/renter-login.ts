import { Renter } from '../../../domain/entity/renter';

export class RenterLoginResponse {
    constructor (
        public email: string,
        public fullname: string,
        public gender: string,
        public profile_picture: string | null,
        public email_verified: boolean,
        public token: string,
    ) {}

    static fromEntity(renter: Renter): RenterLoginResponse {
        return new RenterLoginResponse(
            renter.email,
            renter.fullname,
            renter.gender,
            renter.profilePicture,
            renter.emailVerified,
            renter.token as string,
        );
    }
}