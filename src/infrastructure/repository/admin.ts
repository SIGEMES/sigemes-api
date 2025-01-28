import { PrismaClient } from '@prisma/client';
import { AdminRepositoryInterface } from '../../domain/interface/repository/admin';
import { Admin } from '../../domain/entity/admin';

export class AdminRepository implements AdminRepositoryInterface {
    constructor(private prisma: PrismaClient) { }

    public async getAllAdmin(): Promise<Admin[]> {
        const admins: Admin[] = await this.prisma.admin.findMany();

        return admins;
    }

    public async getAdminById(id: number): Promise<Admin|null> {
        const admin: Admin|null = await this.prisma.admin.findUnique({
            where: { id }
        }) as Admin;

        return admin;
    }

    public async getAdminByEmail(email: string): Promise<Admin|null> {
        const admin: Admin|null = await this.prisma.admin.findUnique({
            where: { email }
        }) as Admin;

        return admin;
    }

    public async createAdmin(admin: Admin): Promise<Admin> {
        const newAdmin: Admin = await this.prisma.admin.create({
            data: {
                email: admin.email,
                password: admin.password,
                fullname: admin.fullname,
                phoneNumber: admin.phoneNumber,
            }
        });

        return newAdmin;
    }

    public async updateAdmin(admin: Admin): Promise<Admin> {
        const updatedAdmin: Admin = await this.prisma.admin.update({
            where: { id: admin.id },
            data: {
                email: admin.email,
                password: admin.password,
                fullname: admin.fullname,
                phoneNumber: admin.phoneNumber,
                profilePicture: admin.profilePicture,
            }
        });

        return updatedAdmin;
    }

    public async updateAdminWithoutPassword(admin: Admin): Promise<Admin> {
        const updatedAdmin: Admin = await this.prisma.admin.update({
            where: { id: admin.id },
            data: {
                email: admin.email,
                fullname: admin.fullname,
                phoneNumber: admin.phoneNumber,
                profilePicture: admin.profilePicture,
            }
        });

        return updatedAdmin;
    }

    public async deleteAdmin(id: number): Promise<Admin> {
        const deletedAdmin: Admin = await this.prisma.admin.delete({
            where: { id }
        });

        return deletedAdmin;
    }
}