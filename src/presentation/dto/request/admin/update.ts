import { Admin } from '../../../../domain/entity/admin';

export class UpdateAdminRequest {
    constructor (
        public id: number,
        public email: string,
        public password: string,
        public fullname: string,
        public phone_number: string,
    ) {}

    public static toEntity(data: UpdateAdminRequest): Admin {
        return new Admin(
            data.id,
            data.email,
            data.password,
            data.fullname,
            data.phone_number,
        );
    }
}