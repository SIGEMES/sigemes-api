import { PrismaClient } from '@prisma/client';
import { RenterRepoInterface } from '../../domain/interface/renter-repo';
import { Renter } from '../../domain/entity/renter';

export class RenterRepo implements RenterRepoInterface {
    constructor(private prisma: PrismaClient) { }

    async getUserByEmail(email: string): Promise<Renter|null> {
        const renter:Renter|null = await this.prisma.renter.findUnique({
            where: { email }
        });

        if (!renter) {
            return renter;
        }

        return renter;
    };

    async createUser(renter: Renter): Promise<Renter> {
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

}
