import { GuesthouseRoom } from "../domain/entity/guesthouse-room";
import { GuesthouseRoomMedia } from "../domain/entity/guesthouse-room-media";
import { GuesthouseRoomPricing } from "../domain/entity/guesthouse-room-pricing";
import { ResponseError } from "../domain/error/response-error";
import { ObjectStorageInterface } from "../domain/interface/external-service/object-storage";
import { File } from "../domain/interface/library/file";
import { GuesthouseRoomRepositoryInterface } from "../domain/interface/repository/guesthouse-room";
import { DbTransactionInterface } from "../domain/interface/repository/db-transaction";
import { GuesthouseRoomValidation } from "../presentation/validation/guesthouse-room";

export class GuesthouseRoomUsecase {
    constructor(
        private guesthouseRoomRepository: GuesthouseRoomRepositoryInterface,
        private objectStorageService: ObjectStorageInterface,
        private dbTransaction: DbTransactionInterface,
    ) {}

    public async getAllGuesthouseRooms(guesthouseId: number): Promise<GuesthouseRoom[]> {
        const guesthouseRooms: GuesthouseRoom[] = await this.guesthouseRoomRepository.getAllRoomsByGuesthouseId(guesthouseId);

        return guesthouseRooms;
    }

    public async getGuesthouseRoomById(id: number): Promise<GuesthouseRoom> {
        const guesthouseRoom: GuesthouseRoom|null = await this.guesthouseRoomRepository.getGuesthouseRoomById(id);

        if (!guesthouseRoom) {
            throw new ResponseError("Guesthouse room not found", 404);
        }

        return guesthouseRoom;
    }

    public async createGuesthouseRoom(room: GuesthouseRoom, roomMedia: File[]): Promise<GuesthouseRoom> {
        // hash filename
        roomMedia = roomMedia.map(file => ({
            ...file,
            originalName: `${Date.now()}-${Math.random().toString(36).substring(7)}-${file.originalName}`,
        }));

        const roomMediaURL: string[] = await this.objectStorageService.uploadMultipleFiles(roomMedia, "guesthouse-media");

        // map roomMediaURL to roomMedia attribute
        room.guesthouseRoomMedia = roomMediaURL.map((url, index) => ({
            id: index,
            guesthouseRoomId: room.id,
            url,
        }));

        const newRoom: GuesthouseRoom = await this.guesthouseRoomRepository.createGuesthouseRoom(room);

        return newRoom;
    }
    
}