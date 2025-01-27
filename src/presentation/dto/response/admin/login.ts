import { Admin } from '../../../../domain/entity/admin';

export class AdminLoginResponse {
    constructor (
        public id: number,
        public email: string,
        public fullname: string,
        public phone_number: string,
        public profile_picture: string | null,
        public token: string,
    ) {}

    static fromEntity(admin: Admin, token: string): AdminLoginResponse {
        return new AdminLoginResponse(
            admin.id,
            admin.email,
            admin.fullname,
            admin.phoneNumber,
            admin.profilePicture,
            token,
        );
    }
}