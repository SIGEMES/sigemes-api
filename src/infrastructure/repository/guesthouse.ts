import { PrismaClient } from "@prisma/client";
import { GuesthouseRepositoryInterface } from "../../domain/interface/repository/guesthouse";
import { Guesthouse } from "../../domain/entity/guesthouse";

export class GuesthouseRepository implements GuesthouseRepositoryInterface {
    constructor(private prisma: PrismaClient) { }

    public async getAllGuesthouses(): Promise<Guesthouse[]> {
        const guesthouses: Guesthouse[] = await this.prisma.guesthouse.findMany(
            {
                include: {
                    guesthouseMedia: true,
                }
            }
        );

        return guesthouses;
    }

    public async getGuesthouseById(id: number): Promise<Guesthouse|null> {
        const guesthouse: Guesthouse|null = await this.prisma.guesthouse.findUnique({
            where: {
                id: id
            },
            include: {
                guesthouseMedia: true,
            }
        });

        return guesthouse;
    }
}