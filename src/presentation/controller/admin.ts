import { Request, Response, NextFunction } from 'express';
import { Admin } from '../../domain/entity/admin';
import { AdminUsecase } from '../../usecase/admin';
import { AdminLoginResponse } from '../dto/response/admin/login';
import { BaseSuccessResponse } from '../dto/response/base/base-success';
import { AdminValidation } from '../validation/admin';
import { AdminGetDataResponse } from '../dto/response/admin/get-data';
import { CreateAdminRequest } from '../dto/request/admin/create';
import { UpdateAdminRequest } from '../dto/request/admin/update';
import { File } from '../../domain/interface/library/file';

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
            const admin: Admin = await this.adminUsecase.getAdminById(Number(req.params.id));
            const adminResponse: AdminGetDataResponse = AdminGetDataResponse.fromEntity(admin);
            res.status(200).json(new BaseSuccessResponse(true, "Get admin by id success", adminResponse));
        } catch (error) {
            next(error);
        }
    }

    public async getCurrentAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const admin: Admin = await this.adminUsecase.getAdminById(Number(res.locals.user.id));
            const adminResponse: AdminGetDataResponse = AdminGetDataResponse.fromEntity(admin);
            res.status(200).json(new BaseSuccessResponse(true, "Get current admin profile success", adminResponse));
        } catch (error) {
            next(error);
        }
    }

    public async createAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const validatedData: CreateAdminRequest = AdminValidation.createAdmin.parse(req.body);
            const admin: Admin = await this.adminUsecase.createAdmin(CreateAdminRequest.toEntity(validatedData));
            const adminResponse: AdminGetDataResponse = AdminGetDataResponse.fromEntity(admin);
            res.status(201).json(new BaseSuccessResponse(true, "Create admin success", adminResponse));
        } catch (error) {
            next(error);
        }
    }

    public async updateAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            let validatedData: UpdateAdminRequest;
            let fileData: File | undefined;

            req.body.id = Number(req.params.id);

            if (req.body.password) {
                validatedData = AdminValidation.updateAdmin.parse(req.body);
            } else {
                validatedData = AdminValidation.updateAdminWithoutPassword.parse(req.body);
            }
            
            if (req.file) {
                fileData = {
                    originalName: req.file.originalname,
                    mimeType: req.file.mimetype,
                    size: req.file.size,
                    buffer: req.file.buffer,
                };
            }
            
            const admin: Admin = await this.adminUsecase.updateAdmin(UpdateAdminRequest.toEntity(validatedData), fileData);
            const adminResponse: AdminGetDataResponse = AdminGetDataResponse.fromEntity(admin);
            res.status(200).json(new BaseSuccessResponse(true, "Update admin success", adminResponse));
        } catch (error) {
            next(error);
        }
    }
}