import { PrismaClient } from "@prisma/client";
import { GuesthouseRoomRepositoryInterface } from "../../domain/interface/repository/guesthouse-room";
import { GuesthouseRoom } from "../../domain/entity/guesthouse-room";
import { GuesthouseRoomMedia } from "../../domain/entity/guesthouse-room-media";
import { GuesthouseRoomPricing } from "../../domain/entity/guesthouse-room-pricing";

export class GuesthouseRoomRepository implements GuesthouseRoomRepositoryInterface {
    constructor(private prisma: PrismaClient) { }

    public async getAllRoomsByGuesthouseId(guesthouseId: number): Promise<GuesthouseRoom[]> {
        const guesthouseRooms: GuesthouseRoom[] = await this.prisma.guesthouseRoom.findMany(
            {
                where: {
                    guesthouseId: guesthouseId
                },
                include: {
                    guesthouseRoomMedia: {
                        orderBy: {
                            id: 'asc'
                        },
                    },
                    guesthouseRoomPricing: {
                        orderBy: {
                            id: 'asc'
                        },
                    }
                }
            }
        ) as GuesthouseRoom[];

        return guesthouseRooms;
    }

    public async getGuesthouseRoomById(id: number): Promise<GuesthouseRoom|null> {
        const guesthouseRoom: GuesthouseRoom|null = await this.prisma.guesthouseRoom.findUnique(
            {
                where: {
                    id: id
                },
                include: {
                    guesthouseRoomMedia: {
                        orderBy: {
                            id: 'asc'
                        },
                    },
                    guesthouseRoomPricing: {
                        orderBy: {
                            id: 'asc'
                        },
                    }
                }
            }
        ) as GuesthouseRoom;

        return guesthouseRoom;
    }

    public async getGuesthouseRoomMediaById(id: number): Promise<GuesthouseRoomMedia|null> {
        const guesthouseRoomMedia: GuesthouseRoomMedia|null = await this.prisma.guesthouseRoomMedia.findUnique(
            {
                where: {
                    id: id
                }
            }
        );

        return guesthouseRoomMedia;
    }

    public async createGuesthouseRoom(room: GuesthouseRoom): Promise<GuesthouseRoom> {
        const createdRoom: GuesthouseRoom = await this.prisma.guesthouseRoom.create(
            {
                data: {
                    guesthouseId: room.guesthouseId,
                    name: room.name,
                    type: room.type,
                    facilities: room.facilities,
                    availableSlot: room.availableSlot,
                    totalSlot: room.totalSlot,
                    areaM2: room.areaM2,
                    status: room.status,
                    guesthouseRoomMedia: {
                        create: room.guesthouseRoomMedia.map(media => ({
                            url: media.url
                        }))
                    },
                    guesthouseRoomPricing: {
                        create: room.guesthouseRoomPricing.map(pricing => ({
                            retributionType: pricing.retributionType,
                            pricePerDay: pricing.pricePerDay,
                            isActive: pricing.isActive
                        }))
                    }
                },
                select: {
                    id: true,
                    guesthouseId: true,
                    name: true,
                    type: true,
                    facilities: true,
                    availableSlot: true,
                    totalSlot: true,
                    areaM2: true,
                    status: true,
                    guesthouseRoomMedia: {
                        select: {
                            id: true,
                            url: true
                        }
                    },
                    guesthouseRoomPricing: {
                        select: {
                            id: true,
                            retributionType: true,
                            pricePerDay: true,
                            isActive: true
                        }
                    },
                },
            }
        ) as GuesthouseRoom;

        return createdRoom;
    }

    public async createGuesthouseRoomMedia(roomMedia: GuesthouseRoomMedia[], transaction?: any): Promise<GuesthouseRoomMedia[]> {
        const prisma = transaction || this.prisma;

        const createdRoomMedia: GuesthouseRoomMedia[] = await prisma.guesthouseRoomMedia.createManyAndReturn(
            {
                data: roomMedia.map(media => ({
                    guesthouseRoomId: media.guesthouseRoomId,
                    url: media.url,
                })),
                select: {
                    id: true,
                    url: true,
                }
            }
        ) as GuesthouseRoomMedia[];

        return createdRoomMedia;
    }

    public async createGuesthouseRoomPricing(roomPricing: GuesthouseRoomPricing[], transaction?: any): Promise<GuesthouseRoomPricing[]> {
        const prisma = transaction || this.prisma;

        const createdRoomPricing: GuesthouseRoomPricing[] = await prisma.guesthouseRoomPricing.createManyAndReturn(
            {
                data: roomPricing.map(pricing => ({
                    guesthouseRoomId: pricing.guesthouseRoomId,
                    retributionType: pricing.retributionType,
                    pricePerDay: pricing.pricePerDay,
                    isActive: pricing.isActive,
                })),
                select: {
                    id: true,
                    retributionType: true,
                    pricePerDay: true,
                    isActive: true,
                }
            }
        ) as GuesthouseRoomPricing[];

        return createdRoomPricing;
    }

    public async updateGuesthouseRoomOnly(room: GuesthouseRoom, transaction?: any): Promise<GuesthouseRoom> {
        const prisma = transaction || this.prisma;

        const updatedRoom: GuesthouseRoom = await prisma.guesthouseRoom.update(
            {
                where: {
                    id: room.id
                },
                data: {
                    name: room.name,
                    type: room.type,
                    facilities: room.facilities,
                    availableSlot: room.availableSlot,
                    totalSlot: room.totalSlot,
                    areaM2: room.areaM2,
                    status: room.status,
                },
                select: {
                    id: true,
                    guesthouseId: true,
                    name: true,
                    type: true,
                    facilities: true,
                    availableSlot: true,
                    totalSlot: true,
                    areaM2: true,
                    status: true,
                }
            }
        ) as GuesthouseRoom;

        return updatedRoom;
    }

    public async updateGuesthouseRoomPricing(roomPricing: GuesthouseRoomPricing, transaction?: any): Promise<GuesthouseRoomPricing> {
        const prisma = transaction || this.prisma;

        const updatedRoomPricing: GuesthouseRoomPricing = await prisma.guesthouseRoomPricing.update(
            {
                where: {
                    id: roomPricing.id
                },
                data: {
                    retributionType: roomPricing.retributionType,
                    pricePerDay: roomPricing.pricePerDay,
                    isActive: roomPricing.isActive,
                },
                select: {
                    id: true,
                    retributionType: true,
                    pricePerDay: true,
                    isActive: true,
                }
            }
        ) as GuesthouseRoomPricing;

        return updatedRoomPricing;
    }

    public async deleteGuesthouseRoomById(id: number, transaction?: any): Promise<void> {
        const prisma = transaction || this.prisma;

        await prisma.guesthouseRoom.delete(
            {
                where: {
                    id: id
                }
            }
        );
    }

    public async deleteGuesthouseRoomMediaById(id: number, transaction?: any): Promise<void> {
        const prisma = transaction || this.prisma;

        await prisma.guesthouseRoomMedia.deleteMany(
            {
                where: {
                    id: id
                }
            }
        );
    }

    public async deleteGuesthouseRoomPricingById(id: number, transaction?: any): Promise<void> {
        const prisma = transaction || this.prisma;

        await prisma.guesthouseRoomPricing.deleteMany(
            {
                where: {
                    id: id
                }
            }
        );
    }
}