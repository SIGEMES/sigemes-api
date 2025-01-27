import { Admin } from '../../../../domain/entity/admin';

export class CreateAdminRequest {
    constructor (
        public email: string,
        public password: string,
        public fullname: string,
        public phone_number: string,
    ) {}

    public static toEntity(data: CreateAdminRequest): Admin {
        return new Admin(
            0,
            data.email,
            data.password,
            data.fullname,
            data.phone_number,
        );
    }
}