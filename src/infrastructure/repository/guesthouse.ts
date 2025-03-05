import { PrismaClient } from "@prisma/client";
import { GuesthouseRepositoryInterface } from "../../domain/interface/repository/guesthouse";
import { Guesthouse } from "../../domain/entity/guesthouse";
import { GuesthouseMedia } from "../../domain/entity/guesthouse-media";

export class GuesthouseRepository implements GuesthouseRepositoryInterface {
    constructor(private prisma: PrismaClient) { }

    public async getAllGuesthouses(): Promise<Guesthouse[]> {
        const guesthouses: Guesthouse[] = await this.prisma.guesthouse.findMany(
            {
                include: {
                    guesthouseMedia: true,
                }
            }
        ) as Guesthouse[];

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
        }) as Guesthouse|null;

        return guesthouse;
    }

    public async getGuesthouseMediaById(id: number): Promise<GuesthouseMedia|null> {
        const guesthouseMedia: GuesthouseMedia|null = await this.prisma.guesthouseMedia.findUnique({
            where: {
                id: id
            }
        });

        return guesthouseMedia;
    }

    public async createGuesthouse(guesthouse: Guesthouse, transaction?: any): Promise<Guesthouse> {
        const prisma = transaction || this.prisma;

        const createdGuesthouse: Guesthouse = await prisma.guesthouse.create({
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

    public async createGuesthouseMedia(guesthouseMedia: GuesthouseMedia[], transaction?: any): Promise<GuesthouseMedia[]> {
        const prisma = transaction || this.prisma;
        
        const createdGuesthouseMedia: GuesthouseMedia[] = await prisma.guesthouseMedia.createManyAndReturn({
            data: guesthouseMedia.map(media => ({
                guesthouseId: media.guesthouseId,
                url: media.url,
            })),
            select: {
                id: true,
                url: true,
            },
        }) as GuesthouseMedia[];

        return createdGuesthouseMedia;
    }

    public async updateGuesthouseOnly(id: number, guesthouse: Guesthouse, transaction?: any): Promise<Guesthouse> {
        const prisma = transaction || this.prisma;
        
        const updatedGuesthouse: Guesthouse = await prisma.guesthouse.update({
            where: {
                id: id,
            },
            data: {
                name: guesthouse.name,
                description: guesthouse.description,
                facilities: guesthouse.facilities,
                areaM2: guesthouse.areaM2,
                address: guesthouse.address,
                latitude: guesthouse.latitude,
                longitude: guesthouse.longitude,
                contactPerson: guesthouse.contactPerson,
            },
            include: {
                guesthouseMedia: true,
            }
        });

        return updatedGuesthouse;
    }

    public async deleteGuesthouse(id: number): Promise<void> {
        await this.prisma.guesthouse.delete({
            where: {
                id: id,
            },
            include: {
                guesthouseMedia: true,
            }
        });

    }

    public async deleteGuesthouseMedia(id: number, transaction?: any): Promise<void> {
        const prisma = transaction || this.prisma;
        
        await prisma.guesthouseMedia.delete({
            where: {
                id: id,
            },
        });
    }

    public async getAllGuesthousesWithPricing(): Promise<Guesthouse[]> {
        const guesthouses: Guesthouse[] = await this.prisma.guesthouse.findMany({
            select : {
                name: true,
                guesthouseRoom: {
                    select: {
                        guesthouseRoomPricing: {
                            select: {
                                id: true,
                            },
                        },
                    },
                },
            },
        }) as Guesthouse[];

        return guesthouses;
    }
}