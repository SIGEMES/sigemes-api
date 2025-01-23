export type Gender = 'male' | 'female';

export class Renter {
    constructor (
        public id: number,
        public email: string,
        public password: string,
        public newPassword: string,
        public fullname: string,
        public phoneNumber: string,
        public gender: Gender,
        public profilePicture: string,
        public emailVerified: boolean,
        public forgotPasswordVerified: boolean,
        public otp: string | null,
        public otpExpiry: Date | null,
        public createdAt: Date,
        public updatedAt: Date,
        public token?: string,
    ) {}
}
