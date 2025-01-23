import { PrismaClient } from '@prisma/client';
import { RenterRepoInterface } from '../../domain/interface/renter-repo';
import { Renter } from '../../domain/entity/renter';

export class RenterRepo implements RenterRepoInterface {
    constructor(private prisma: PrismaClient) { }

    public async getUserByEmail(email: string): Promise<Renter|null> {
        const renter:Renter|null = await this.prisma.renter.findUnique({
            where: { email }
        });

        if (!renter) {
            return renter;
        }

        return renter;
    };

    public async createUser(renter: Renter): Promise<Renter> {
        const createdRenter: Renter = await this.prisma.renter.create({
            data: {
                email: renter.email,
                password: renter.password,
                fullname: renter.fullname,
                phoneNumber: renter.phoneNumber,
                gender: renter.gender
            }
        });

        return createdRenter;
    };

    public async updateOTP(id: number, otp: string, otpExpiry: Date): Promise<void> {
        await this.prisma.renter.update({
            where: { id },
            data: {
                otp,
                otpExpiry
            }
        });
    };
}
