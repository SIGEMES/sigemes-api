import { PrismaClient } from '@prisma/client';
import { RenterRepoInterface } from '../../domain/interface/renter-repo';
import { Renter } from '../../domain/entity/renter';

export class RenterRepo implements RenterRepoInterface {
    constructor(private prisma: PrismaClient) { }

    public async getUserByEmail(email: string): Promise<Renter|null> {
        const renter:Renter|null = await this.prisma.renter.findUnique({
            where: { email }
        }) as Renter;

        return renter;
    }

    public async createUser(renter: Renter): Promise<Renter> {
        const createdRenter: Renter = await this.prisma.renter.create({
            data: {
                email: renter.email,
                password: renter.password,
                fullname: renter.fullname,
                phoneNumber: renter.phoneNumber,
                gender: renter.gender
            }
        }) as Renter;

        return createdRenter;
    }

    public async updateOTP(id: number, otp: string, otpExpiry: Date): Promise<void> {
        await this.prisma.renter.update({
            where: { id },
            data: {
                otp,
                otpExpiry
            }
        });
    }

    public async getUserOTPByEmail(email: string): Promise<Renter|null> {
        const renter: Renter | null = await this.prisma.renter.findUnique({
            where: { email },
            select: {
                id: true,
                otp: true,
                otpExpiry: true
            },
        }) as Renter;
        
        return renter;
    }

    public async updateEmailVerified(id: number): Promise<void> {
        await this.prisma.renter.update({
            where: { id },
            data: {
                emailVerified: true,
                otp: null,
                otpExpiry: null
            }
        });
    }

    public async updatePassword(id: number, password: string): Promise<void> {
        await this.prisma.renter.update({
            where: { id },
            data: {
                password
            }
        });
    }
}
