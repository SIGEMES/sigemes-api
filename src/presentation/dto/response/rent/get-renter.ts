import { Renter } from "../../../../domain/entity/renter";

export class GetRenterResponse {
    constructor(
        public id: number,
        public email: string,
        public fullname: string,
        public phone_number: string,
        public gender: string,
        public profile_picture: string,
    ) {}

    public static fromEntity(renter: Renter|null): GetRenterResponse|undefined {
        if (!renter) return undefined;
        
        return new GetRenterResponse(
            renter.id,
            renter.email,
            renter.fullname,
            renter.phoneNumber,
            renter.gender,
            renter.profilePicture,
        );
    }
}