export type Gender = 'perempuan' | 'laki_laki';

export class Renter {
    constructor (
        public id: number = 0,
        public email: string = '',
        public password: string = '',
        public fullname: string = '',
        public phoneNumber: string = '',
        public gender: Gender = 'laki_laki',
        public profilePicture: string = '',
        public emailVerified: boolean = false,
        public forgotPasswordVerified: boolean = false,
        public otp: string | null = null,
        public otpExpiry: Date | null = null,
        public createdAt: Date = new Date(),
        public updatedAt: Date = new Date(),
    ) {}
}
