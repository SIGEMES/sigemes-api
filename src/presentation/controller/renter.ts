import { Request, Response, NextFunction } from 'express';
import { RenterUsecase } from '../../usecase/renter';
import { Renter } from '../../domain/entity/renter';
import { RenterLoginResponse } from '../dto/response/renter/login';
import { RenterGetDataResponse } from '../dto/response/renter/get-data';
import { BaseSuccessResponse } from '../dto/response/base/base-success';
import { RenterValidation } from '../validation/renter';
import { RenterRegisterRequest } from '../dto/request/renter/register';
import { RenterUpdateProfileRequest } from '../dto/request/renter/update-profile';
import { File } from '../../domain/interface/library/file';

export class RenterController {
    constructor(private renterUsecase: RenterUsecase) {}

    public async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const validatedData: {
                email: string,
                password: string
            } = RenterValidation.login.parse(req.body);

            const data: {
                renterData: Renter,
                token: string
            } = await this.renterUsecase.login(validatedData.email, validatedData.password);

            const renterResponse: RenterLoginResponse = RenterLoginResponse.fromEntity(data.renterData, data.token);
            res.status(200).json(new BaseSuccessResponse(true, "Login success", renterResponse));
        } catch (error) {
            next(error);
        }
    }

    public async getRenterById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = RenterValidation.id.parse({ id: Number(req.params.id) });
            const renter: Renter = await this.renterUsecase.getRenterById(id);
            const renterResponse: RenterGetDataResponse = RenterGetDataResponse.fromEntity(renter);
            res.status(200).json(new BaseSuccessResponse(true, "Get renter data success", renterResponse));
        } catch (error) {
            next(error);
        }
    }

    public async register(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const validatedData: RenterRegisterRequest = RenterValidation.register.parse(req.body);
            const renter: Renter = await this.renterUsecase.register(RenterRegisterRequest.toEntity(validatedData));
            const renterResponse: RenterGetDataResponse = RenterGetDataResponse.fromEntity(renter);
            res.status(201).json(new BaseSuccessResponse(true, "Register success", renterResponse));
        } catch (error) {
            next(error);
        }
    }

    public async sendEmailVerificationOTP(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const validatedData: { email:string } = RenterValidation.sendEmailOTP.parse(req.body);
            await this.renterUsecase.sendOTP(validatedData.email, "emailVerification");
            res.status(200).json(new BaseSuccessResponse(true, "Send verification email OTP success", null));
        } catch (error) {
            next(error);
        }
    }

    public async verifyEmailVerificationOTP(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const validatedData: {
                email: string,
                otp: string
            } = RenterValidation.verifyEmailOTP.parse(req.body);
            
            await this.renterUsecase.verifyOTP(validatedData.email, validatedData.otp, "emailVerification");
            res.status(200).json(new BaseSuccessResponse(true, "Verify email OTP success", null));
        } catch (error) {
            next(error);
        }
    }

    public async changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = RenterValidation.id.parse({ id: Number(req.params.id) });

            const validatedData: {
                old_password: string,
                new_password: string
            } = RenterValidation.changePassword.parse(req.body);

            await this.renterUsecase.changePassword(id, res.locals.user.id, validatedData.old_password, validatedData.new_password);
            res.status(200).json(new BaseSuccessResponse(true, "Update password success", null));
        } catch (error) {
            next(error);
        }
    }

    public async sendForgotPasswordOTP(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const validatedData: { email:string } = RenterValidation.sendEmailOTP.parse(req.body);
            await this.renterUsecase.sendOTP(validatedData.email, "forgotPassword");
            res.status(200).json(new BaseSuccessResponse(true, "Send forgot password OTP success", null));
        } catch (error) {
            next(error);
        }
    }

    public async verifyForgotPasswordOTP(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const validatedData: {
                email: string,
                otp: string
            } = RenterValidation.verifyEmailOTP.parse(req.body);
            
            await this.renterUsecase.verifyOTP(validatedData.email, validatedData.otp, "forgotPassword");
            res.status(200).json(new BaseSuccessResponse(true, "Verify forgot password OTP success", null));
        } catch (error) {
            next(error);
        }
    }


    public async changePasswordForgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const validatedData: {
                email: string,
                new_password: string
            } = RenterValidation.changePasswordForgotPassword.parse(req.body);

            await this.renterUsecase.changePasswordForgotPassword(validatedData.email, validatedData.new_password);
            res.status(200).json(new BaseSuccessResponse(true, "Update password success", null));
        } catch (error) {
            next(error);
        }
    }

    public async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = RenterValidation.id.parse({ id: Number(req.params.id) });
            const validatedData: RenterUpdateProfileRequest = RenterValidation.updateProfile.parse(req.body);
            const renterValidatedData: Renter = RenterUpdateProfileRequest.toEntity(validatedData);

            let fileData: File | undefined;
            if (req.file) {
                fileData = {
                    originalName: req.file.originalname,
                    mimeType: req.file.mimetype,
                    size: req.file.size,
                    buffer: req.file.buffer,
                };
            }

            const renter: Renter = await this.renterUsecase.updateProfile(id, res.locals.user.id, renterValidatedData, fileData);
            const renterResponse: RenterGetDataResponse = RenterGetDataResponse.fromEntity(renter);
            res.status(200).json(new BaseSuccessResponse(true, "Update profile success", renterResponse));
        } catch (error) {
            next(error);
        }
    }
}