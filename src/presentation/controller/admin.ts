import { Request, Response, NextFunction } from 'express';
import { Admin } from '../../domain/entity/admin';
import { AdminUsecase } from '../../usecase/admin';
import { AdminLoginResponse } from '../dto/response/admin/login';
import { BaseSuccessResponse } from '../dto/response/base/base-success';
import { AdminValidation } from '../validation/admin';

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
}