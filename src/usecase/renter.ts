import { Renter } from '../domain/entity/renter';
import { RenterRepositoryInterface } from '../domain/interface/repository/renter';
import { JwtInterface } from '../domain/interface/library/jwt';
import { BcryptInterface } from '../domain/interface/library/bcrypt';
import { ResponseError } from '../domain/error/response-error';
import { MailerInterface } from '../domain/interface/external-service/mailer';
import { ObjectStorageInterface } from '../domain/interface/external-service/object-storage';
import { File } from '../domain/interface/library/file';

export class RenterUsecase {
    constructor(
        private renterRepository: RenterRepositoryInterface,
        private jwtService: JwtInterface,
        private bcryptService: BcryptInterface,
        private mailerService: MailerInterface,
        private objectStorageService: ObjectStorageInterface
    ) {}

    public async login(email: string, password: string): Promise<{ renterData: Renter, token: string }> {
        const renterData: Renter | null = await this.renterRepository.getRenterByEmail(email);

        if (!renterData) {
            throw new ResponseError('Email not found', 400);
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

    public async getRenterById(id: number): Promise<Renter> {
        const renterData: Renter | null = await this.renterRepository.getRenterById(id);

        if (!renterData) {
            throw new ResponseError('Renter data not found', 200);
        }

        return renterData;
    }

    public async register(renter: Renter): Promise<Renter> {
        const renterData: Renter | null = await this.renterRepository.getRenterByEmail(renter.email);

        if (renterData) {
            throw new ResponseError('Email already registered', 400);
        }

        const hashedPassword: string = await this.bcryptService.hashPassword(renter.password);
        renter.password = hashedPassword;

        const newRenter: Renter = await this.renterRepository.createRenter(renter);

        return newRenter;
    }

    public async sendOTP(email: string, action: string): Promise<void> {
        const renterData: Renter | null = await this.renterRepository.getRenterByEmail(email);

        if (!renterData) {
            throw new ResponseError('Email not found', 200);
        }

        const otp: string = Math.floor(10000 + Math.random() * 90000).toString();
        const otpExpiry: Date = new Date(Date.now() + 600000);

        await this.renterRepository.updateOTP(renterData.id, otp, otpExpiry);
        
        if (action === 'emailVerification') {
            await this.mailerService.sendEmail(renterData.email, 'Verifikasi Email SIGEMES', otp, 'verifikasi email');
        } else {
            await this.mailerService.sendEmail(renterData.email, 'Reset Password SIGEMES', otp, 'reset password');
        }
    }

    public async verifyOTP(email: string, otp:string, action: string): Promise<void> {
        const renterData: Renter | null = await this.renterRepository.getRenterOTPByEmail(email);

        if (!renterData) {
            throw new ResponseError('Email not found', 400);
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
            await this.renterRepository.updateEmailVerified(renterData.id);
        } else {
            await this.renterRepository.updateForgotPasswordVerified(renterData.id);
        }
    }

    public async changePassword(idParam: number, idToken: number, oldPassword: string, newPassword: string): Promise<void> {
        if (idParam !== idToken) {
            throw new ResponseError('Unauthorized', 401);
        }

        const renterData: Renter | null = await this.renterRepository.getRenterById(idToken);

        if (!renterData) {
            throw new ResponseError('Renter not found', 400);
        }

        if (oldPassword === newPassword) {
            throw new ResponseError('New password cannot be the same as old password', 400);
        }

        const passwordMatch = await this.bcryptService.comparePassword(oldPassword, renterData.password);

        if (!passwordMatch) {
            throw new ResponseError('Invalid old password', 400);
        }

        const hashedPassword: string = await this.bcryptService.hashPassword(newPassword);

        await this.renterRepository.updatePassword(renterData.id, hashedPassword);
    }

    public async changePasswordForgotPassword(email: string, newPassword: string): Promise<void> {
        const renterData: Renter | null = await this.renterRepository.getRenterByEmail(email);

        if (!renterData) {
            throw new ResponseError('Email not found', 400);
        }

        if (renterData.forgotPasswordVerified === false) {
            throw new ResponseError('Renter not verified to reset password', 400);
        }

        const hashedPassword: string = await this.bcryptService.hashPassword(newPassword);

        await this.renterRepository.updatePasswordForgotPassword(renterData.id, hashedPassword);
    }

    public async updateProfile(idParam: number, idToken: number, renter: Renter, profilePicture?: File): Promise<Renter> {
        if (idParam !== idToken) {
            throw new ResponseError('Unauthorized', 401);
        }

        const renterData: Renter | null = await this.renterRepository.getRenterById(idToken);

        if (!renterData) {
            throw new ResponseError('Renter not found', 400);
        }

        renter.profilePicture = renterData.profilePicture;

        if (profilePicture) {
            const oldProfilePicture: string = renterData.profilePicture.split('/').pop() as string;
            const oldProfilePicturePath: string = `profile-pictures/${oldProfilePicture}`;

            if (oldProfilePicture !== 'default-picture.png') {
                await this.objectStorageService.deleteFile(oldProfilePicturePath);
            }

            const hashName: string = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
            profilePicture.originalName = hashName + profilePicture.originalName;

            const imageUrl: string = await this.objectStorageService.uploadFile(profilePicture, 'profile-pictures');
            renter.profilePicture = imageUrl;
        }

        const updatedRenter: Renter = await this.renterRepository.updateProfile(idToken, renter);

        return updatedRenter;
    }
}