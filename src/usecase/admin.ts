import { Admin } from "../domain/entity/admin";
import { AdminRepositoryInterface } from "../domain/interface/repository/admin";
import { JwtInterface } from "../domain/interface/library/jwt";
import { BcryptInterface } from "../domain/interface/library/bcrypt";
import { ResponseError } from "../domain/error/response-error";
import { File } from "../domain/interface/library/file";
import { ObjectStorageInterface } from "../domain/interface/external-service/object-storage";

export class AdminUsecase {
    constructor(
        private adminRepository: AdminRepositoryInterface,
        private jwtService: JwtInterface,
        private bcryptService: BcryptInterface,
        private objectStorageService: ObjectStorageInterface
    ) {}

    public async login(email: string, password: string): Promise<{ adminData: Admin, token: string }> {
        const adminData: Admin | null = await this.adminRepository.getAdminByEmail(email);

        if (!adminData) {
            throw new ResponseError('Admin email not found', 404);
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
            throw new ResponseError('Admin not found', 404);
        }

        return admin;
    }

    public async createAdmin(admin: Admin): Promise<Admin> {
        const adminData: Admin | null = await this.adminRepository.getAdminByEmail(admin.email);

        if (adminData) {
            throw new ResponseError('Email already registered', 400);
        }

        const hashedPassword: string = await this.bcryptService.hashPassword(admin.password);
        admin.password = hashedPassword;
        
        const newAdmin: Admin = await this.adminRepository.createAdmin(admin);

        return newAdmin;
    }

    public async updateAdmin(admin: Admin, profilePicture?: File): Promise<Admin> {
        const adminData: Admin | null = await this.adminRepository.getAdminById(admin.id);

        if (!adminData) {
            throw new ResponseError('Admin not found', 404);
        }

        admin.profilePicture = adminData.profilePicture;

        if (profilePicture) {
            const oldProfilePicture: string = adminData.profilePicture.split('/').pop() as string;
            const oldProfilePicturePath: string = `profile-pictures/${oldProfilePicture}`;

            if (oldProfilePicture !== 'default-picture.png') {
                await this.objectStorageService.deleteFile(oldProfilePicturePath);
            }

            const hashName: string = `${Date.now()}-${Math.random().toString(36).substring(7)}`;
            profilePicture.originalName = hashName + profilePicture.originalName;

            const imageUrl: string = await this.objectStorageService.uploadFile(profilePicture, 'profile-pictures');
            admin.profilePicture = imageUrl;
        }

        let updatedAdmin: Admin;
        if (admin.password !== '') {
            const hashedPassword: string = await this.bcryptService.hashPassword(admin.password);
            admin.password = hashedPassword;
            updatedAdmin = await this.adminRepository.updateAdmin(admin);
        } else {
            updatedAdmin = await this.adminRepository.updateAdminWithoutPassword(admin);
        }
        
        return updatedAdmin;
    }

    public async deleteAdmin(id: number): Promise<Admin> {
        const admin: Admin | null = await this.adminRepository.getAdminById(id);

        if (!admin) {
            throw new ResponseError('Admin not found', 404);
        }

        const deletedAdmin: Admin = await this.adminRepository.deleteAdmin(id);

        return deletedAdmin;
    }
}