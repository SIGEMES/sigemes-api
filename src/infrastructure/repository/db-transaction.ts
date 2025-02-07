import { PrismaClient } from '@prisma/client';
import { DbTransactionInterface } from '../../domain/interface/repository/db-transaction';

export class DbTransaction implements DbTransactionInterface {
    constructor(private prisma: PrismaClient) { }

    public async run<T>(callback: (transaction: any) => Promise<T>): Promise<T> {
        return await this.prisma.$transaction(callback);
    }
}