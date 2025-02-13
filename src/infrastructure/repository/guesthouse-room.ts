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
                    guesthouseRoomMedia: true,
                    guesthouseRoomPricing: true,
                }
            }
        );

        return guesthouseRooms;
    }

    public async getGuesthouseRoomById(id: number): Promise<GuesthouseRoom|null> {
        const guesthouseRoom: GuesthouseRoom|null = await this.prisma.guesthouseRoom.findUnique(
            {
                where: {
                    id: id
                },
                include: {
                    guesthouseRoomMedia: true,
                    guesthouseRoomPricing: true,
                }
            }
        );

        return guesthouseRoom;
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
}