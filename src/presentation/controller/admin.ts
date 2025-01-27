import { Request, Response, NextFunction } from 'express';
import { Admin } from '../../domain/entity/admin';
import { AdminUsecase } from '../../usecase/admin';
import { AdminLoginResponse } from '../dto/response/admin/login';
import { BaseSuccessResponse } from '../dto/response/base/base-success';
import { AdminValidation } from '../validation/admin';
import { AdminGetDataResponse } from '../dto/response/admin/get-data';

export class AdminController {
    constructor(private adminUsecase: AdminUsecase) {}

    public async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const validatedData: {
                email: string,
                password: string
            } = AdminValidation.login.parse(req.body);

            const data: {
                adminData: Admin,
                token: string
            } = await this.adminUsecase.login(validatedData.email, validatedData.password);

            const adminResponse: AdminLoginResponse = AdminLoginResponse.fromEntity(data.adminData, data.token);
            res.status(200).json(new BaseSuccessResponse(true, "Login success", adminResponse));
        } catch (error) {
            next(error);
        }
    }

    public async getAllAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const admins: Admin[] = await this.adminUsecase.getAllAdmin();
            const adminResponse: AdminGetDataResponse[] = admins.map(admin => AdminGetDataResponse.fromEntity(admin));
            res.status(200).json(new BaseSuccessResponse(true, "Get all admin success", adminResponse));
        } catch (error) {
            next(error);
        }
    }

    public async getAdminById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            console.log("**********************");
            const admin: Admin = await this.adminUsecase.getAdminById(Number(req.params.id));
            const adminResponse: AdminGetDataResponse = AdminGetDataResponse.fromEntity(admin);
            res.status(200).json(new BaseSuccessResponse(true, "Get admin by id success", adminResponse));
        } catch (error) {
            next(error);
        }
    }

    public async getCurrentAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            console.log("========================", res.locals.user)
            const admin: Admin = await this.adminUsecase.getAdminById(Number(res.locals.user.id));
            const adminResponse: AdminGetDataResponse = AdminGetDataResponse.fromEntity(admin);
            res.status(200).json(new BaseSuccessResponse(true, "Get current admin profile success", adminResponse));
        } catch (error) {
            next(error);
        }
    }
}