export class Renter {
    constructor (
        public id: number,
        public email: string,
        public password: string,
        public fullname: string,
        public gender: string,
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
