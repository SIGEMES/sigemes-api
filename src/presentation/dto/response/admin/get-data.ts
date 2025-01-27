import { Admin } from '../../../../domain/entity/admin';

export class AdminGetDataResponse {
    constructor (
        public id: number,
        public email: string,
        public fullname: string,
        public phone_number: string,
        public profile_picture: string,
    ) {}

    public static fromEntity(admin: Admin): AdminGetDataResponse {
        return new AdminGetDataResponse(
            admin.id,
            admin.email,
            admin.fullname,
            admin.phoneNumber,
            admin.profilePicture,
        );
    }
}