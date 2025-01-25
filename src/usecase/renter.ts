import { Renter } from '../domain/entity/renter';
import { RenterRepoInterface } from '../domain/interface/renter-repo';
import { JwtInterface } from '../domain/interface/jwt';
import { BcryptInterface } from '../domain/interface/bcrypt';
import { ResponseError } from '../domain/error/response-error';
import { MailerInterface } from '../domain/interface/mailer';

export class RenterUsecase {
    constructor(
        private renterRepo: RenterRepoInterface,
        private jwtService: JwtInterface,
        private bcryptService: BcryptInterface,
        private mailerService: MailerInterface,
    ) {}

    public async login(email: string, password: string): Promise<{ renterData: Renter, token: string }> {
        const renterData: Renter | null = await this.renterRepo.getUserByEmail(email);

        if (!renterData) {
            throw new ResponseError('User not found', 400);
        }

        const passwordMatch = await this.bcryptService.comparePassword(password, renterData.password);

        if (!passwordMatch) {
            throw new ResponseError('Invalid password', 400);
        }

        if (!renterData.emailVerified) {
            throw new ResponseError('Email not verified', 400);
        }

        const token: string = this.jwtService.generateToken({
            id: renterData.id,
            email: renterData.email,
            fullname: renterData.fullname,
            role: "renter",
            emailVerified: renterData.emailVerified,
        });

        return { renterData, token };
    }

    public async getRenterDataByEmail(email: string): Promise<Renter> {
        const renterData: Renter | null = await this.renterRepo.getUserByEmail(email);

        if (!renterData) {
            throw new ResponseError('User not found', 200);
        }

        return renterData;
    }

    public async register(renter: Renter): Promise<Renter> {
        const renterData: Renter | null = await this.renterRepo.getUserByEmail(renter.email);

        if (renterData) {
            throw new ResponseError('Email already registered', 400);
        }

        const hashedPassword: string = await this.bcryptService.hashPassword(renter.password);
        renter.password = hashedPassword;

        const newRenter: Renter = await this.renterRepo.createUser(renter);

        return newRenter;
    }

    public async sendOTP(email: string, action: string): Promise<void> {
        const renterData: Renter | null = await this.renterRepo.getUserByEmail(email);

        if (!renterData) {
            throw new ResponseError('User not found', 200);
        }

        const otp: string = Math.floor(10000 + Math.random() * 90000).toString();
        const otpExpiry: Date = new Date(Date.now() + 600000);

        await this.renterRepo.updateOTP(renterData.id, otp, otpExpiry);
        
        if (action === 'emailVerification') {
            await this.mailerService.sendEmail(renterData.email, 'Verifikasi Email SIGEMES', otp, 'verifikasi email');
        } else {
            await this.mailerService.sendEmail(renterData.email, 'Reset Password SIGEMES', otp, 'reset password');
        }
    }

    public async verifyOTP(email: string, otp:string, action: string): Promise<void> {
        const renterData: Renter | null = await this.renterRepo.getUserOTPByEmail(email);

        if (!renterData) {
            throw new ResponseError('User not found', 400);
        }

        if (!renterData.otp || !renterData.otpExpiry) {
            throw new ResponseError('OTP not found', 400);
        }

        if (renterData.otp !== otp) {
            throw new ResponseError('Invalid OTP', 400);
        }

        if (renterData.otpExpiry < new Date()) {
            throw new ResponseError('OTP expired', 400);
        }

        if (action === 'emailVerification') {
            await this.renterRepo.updateEmailVerified(renterData.id);
        }
    }

    public async changePassword(email: string, oldPassword: string, newPassword: string): Promise<void> {
        const renterData: Renter | null = await this.renterRepo.getUserByEmail(email);

        if (!renterData) {
            throw new ResponseError('User not found', 400);
        }

        if (oldPassword === newPassword) {
            throw new ResponseError('New password cannot be the same as old password', 400);
        }

        const passwordMatch = await this.bcryptService.comparePassword(oldPassword, renterData.password);

        if (!passwordMatch) {
            throw new ResponseError('Invalid old password', 400);
        }

        const hashedPassword: string = await this.bcryptService.hashPassword(newPassword);

        await this.renterRepo.updatePassword(renterData.id, hashedPassword);
    }
}