import { Renter } from '../../../domain/entity/renter';

export class RenterGetDataResponse {
    constructor (
        public email: string,
        public fullname: string,
        public gender: string,
        public profile_picture: string | null,
        public email_verified: boolean,
    ) {}

    public static fromEntity(renter: Renter): RenterGetDataResponse {
        return new RenterGetDataResponse(
            renter.email,
            renter.fullname,
            renter.gender,
            renter.profilePicture,
            renter.emailVerified,
        );
    }
}