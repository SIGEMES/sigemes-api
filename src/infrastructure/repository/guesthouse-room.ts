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
}