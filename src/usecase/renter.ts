import { Renter } from '../domain/entity/renter';
import { RenterRepoInterface } from '../domain/interface/renter-repo';
import { JwtInterface } from '../domain/interface/jwt';
import { BcryptInterface } from '../domain/interface/bcrypt';
import { ValidatorInterface } from '../domain/interface/validator';
import { ResponseError } from '../domain/error/response-error';
import { MailerInterface } from '../domain/interface/mailer';

export class RenterUsecase {
    constructor(
        private renterValidator: ValidatorInterface,
        private renterRepo: RenterRepoInterface,
        private jwtService: JwtInterface,
        private bcryptService: BcryptInterface,
        private mailerService: MailerInterface,
    ) {}

    public async login(renter: Renter): Promise<Renter> {
        const loginRequest: Renter = this.renterValidator.validate(renter, "login");

        const renterData: Renter | null = await this.renterRepo.getUserByEmail(loginRequest.email);

        if (!renterData) {
            throw new ResponseError('User not found', 400);
        }

        const passwordMatch = await this.bcryptService.comparePassword(loginRequest.password, renterData.password);

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

        renterData.token = token;

        return renterData;
    }

    public async getRenterData(renter: Renter): Promise<Renter> {
        const renterData: Renter | null = await this.renterRepo.getUserByEmail(renter.email);

        if (!renterData) {
            throw new ResponseError('User not found', 200);
        }

        return renterData;
    }

    public async register(renter: Renter): Promise<Renter> {
        const registerRequest: Renter = this.renterValidator.validate(renter, "register");

        const renterData: Renter | null = await this.renterRepo.getUserByEmail(registerRequest.email);

        if (renterData) {
            throw new ResponseError('Email already registered', 400);
        }

        const hashedPassword: string = await this.bcryptService.hashPassword(registerRequest.password);
        registerRequest.password = hashedPassword;

        const newRenter: Renter = await this.renterRepo.createUser(registerRequest);

        return newRenter;
    }

    public async sendEmailVerificationOTP(renter: Renter): Promise<void> {
        const verifyEmailRequest: Renter = this.renterValidator.validate(renter, "sendEmailVerificationOTP");

        const renterData: Renter | null = await this.renterRepo.getUserByEmail(verifyEmailRequest.email);

        if (!renterData) {
            throw new ResponseError('User not found', 200);
        }

        const otp: string = Math.floor(10000 + Math.random() * 90000).toString();
        const otpExpiry: Date = new Date(Date.now() + 600000);

        await this.renterRepo.updateOTP(renterData.id, otp, otpExpiry);

        await this.mailerService.sendEmail(renterData.email, 'Verifikasi Email SIGEMES', otp, 'verifikasi email');
    }

    public async verifyEmailVerificationOTP(renter: Renter): Promise<void> {
        const verifyEmailRequest: Renter = this.renterValidator.validate(renter, "verifyEmailVerificationOTP");

        const renterData: Renter | null = await this.renterRepo.getUserOTPByEmail(verifyEmailRequest.email);

        if (!renterData) {
            throw new ResponseError('User not found', 400);
        }

        if (!renterData.otp || !renterData.otpExpiry) {
            throw new ResponseError('OTP not found', 400);
        }

        if (renterData.otp !== verifyEmailRequest.otp) {
            throw new ResponseError('Invalid OTP', 400);
        }

        if (renterData.otpExpiry < new Date()) {
            throw new ResponseError('OTP expired', 400);
        }

        await this.renterRepo.updateEmailVerified(renterData.id);
    }

    public async changePassword(renterLoginData: Renter, renterRequestData: Renter): Promise<void> {
        const changePasswordRequest: Renter = this.renterValidator.validate(renterRequestData, "changePassword");

        const renterData: Renter | null = await this.renterRepo.getUserByEmail(renterLoginData.email);

        if (!renterData) {
            throw new ResponseError('User not found', 400);
        }

        if (changePasswordRequest.password === changePasswordRequest.newPassword) {
            throw new ResponseError('New password cannot be the same as old password', 400);
        }

        const passwordMatch = await this.bcryptService.comparePassword(changePasswordRequest.password, renterData.password);

        if (!passwordMatch) {
            throw new ResponseError('Invalid old password', 400);
        }

        const hashedPassword: string = await this.bcryptService.hashPassword(changePasswordRequest.newPassword);

        await this.renterRepo.updatePassword(renterData.id, hashedPassword);
    }
}