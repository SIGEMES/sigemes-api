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

    public async createGuesthouse(guesthouse: Guesthouse): Promise<Guesthouse> {
        const createdGuesthouse: Guesthouse = await this.prisma.guesthouse.create({
            data: {
                name: guesthouse.name,
                description: guesthouse.description,
                facilities: guesthouse.facilities,
                areaM2: guesthouse.areaM2,
                address: guesthouse.address,
                latitude: guesthouse.latitude,
                longitude: guesthouse.longitude,
                contactPerson: guesthouse.contactPerson,
                guesthouseMedia: {
                    create: guesthouse.guesthouseMedia.map(media => ({
                        url: media.url,
                    }))
                }
            },
            include: {
                guesthouseMedia: true,
            }
        });

        return createdGuesthouse;
    }
}