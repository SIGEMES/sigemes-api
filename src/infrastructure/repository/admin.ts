import { PrismaClient } from '@prisma/client';
import { AdminRepositoryInterface } from '../../domain/interface/repository/admin';
import { Admin } from '../../domain/entity/admin';

export class AdminRepository implements AdminRepositoryInterface {
    constructor(private prisma: PrismaClient) { }

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
}