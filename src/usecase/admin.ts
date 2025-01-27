import { Admin } from "../domain/entity/admin";
import { AdminRepositoryInterface } from "../domain/interface/repository/admin";
import { JwtInterface } from "../domain/interface/library/jwt";
import { BcryptInterface } from "../domain/interface/library/bcrypt";
import { ResponseError } from "../domain/error/response-error";

export class AdminUsecase {
    constructor(
        private adminRepository: AdminRepositoryInterface,
        private jwtService: JwtInterface,
        private bcryptService: BcryptInterface
    ) {}

    public async login(email: string, password: string): Promise<{ adminData: Admin, token: string }> {
        const adminData: Admin | null = await this.adminRepository.getAdminByEmail(email);

        if (!adminData) {
            throw new ResponseError('Admin not found', 400);
        }

        const passwordMatch = await this.bcryptService.comparePassword(password, adminData.password);

        if (!passwordMatch) {
            throw new ResponseError('Invalid password', 400);
        }

        let role: string;

        if (adminData.isSuperAdmin === true) {
            role = "super_admin";
        } else {
            role = "admin";
        }

        const token: string = this.jwtService.generateToken({
            id: adminData.id,
            email: adminData.email,
            fullname: adminData.fullname,
            role: role,
        });

        return { adminData, token };
    }

    public async getAllAdmin(): Promise<Admin[]> {
        const admins: Admin[] = await this.adminRepository.getAllAdmin();

        return admins;
    }

    public async getAdminById(id: number): Promise<Admin> {
        const admin: Admin | null = await this.adminRepository.getAdminById(id);

        if (!admin) {
            throw new ResponseError('Admin not found', 400);
        }

        return admin;
    }

    public async createAdmin(admin: Admin): Promise<Admin> {
        const adminData: Admin | null = await this.adminRepository.getAdminByEmail(admin.email);

        if (adminData) {
            throw new ResponseError('Email already used', 400);
        }

        const hashedPassword: string = await this.bcryptService.hashPassword(admin.password);
        admin.password = hashedPassword;
        
        const newAdmin: Admin = await this.adminRepository.createAdmin(admin);

        return newAdmin;
    }
}