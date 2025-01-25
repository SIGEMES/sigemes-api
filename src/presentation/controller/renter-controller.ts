import { Request, Response, NextFunction } from 'express';
import { RenterUsecase } from '../../usecase/renter';
import { Renter } from '../../domain/entity/renter';
import { RenterLoginResponse } from '../dto/response/renter/login';
import { RenterGetDataResponse } from '../dto/response/renter/get-data';
import { BaseSuccessResponse } from '../dto/response/base/base-success';
import { RenterValidation } from '../validation/renter';
import { RenterRegisterRequest } from '../dto/request/renter/register';

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

    public async getRenterData(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const renter: Renter = await this.renterUsecase.getRenterDataByEmail(res.locals.user.email);
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
            const validatedData: {
                old_password: string,
                new_password: string
            } = RenterValidation.changePassword.parse(req.body);

            await this.renterUsecase.changePassword(res.locals.user.email, validatedData.old_password, validatedData.new_password);
            res.status(200).json(new BaseSuccessResponse(true, "Update password success", null));
        } catch (error) {
            next(error);
        }
    }
}