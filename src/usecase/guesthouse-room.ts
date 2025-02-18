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

    public async updateGuesthouseRoom(room: GuesthouseRoom, roomMediaReq: File[], deletedObjectMedia: GuesthouseRoomMedia[]): Promise<GuesthouseRoom> {
        // Using transaction to ensure data consistency
        return await this.dbTransaction.run(async (tx) => {
            const oldRoomData: GuesthouseRoom|null = await this.guesthouseRoomRepository.getGuesthouseRoomById(room.id);
    
            if (!oldRoomData) {
                throw new ResponseError("Guesthouse room not found", 404);
            }
    
            const updatedRoom: GuesthouseRoom = await this.guesthouseRoomRepository.updateGuesthouseRoomOnly(room, tx);

            const oldRoomPricingCount: number = oldRoomData.guesthouseRoomPricing.length;
            let notNewRoomPricingCount: number = 0;
            let newRoomPricingData: GuesthouseRoomPricing[] = [];
            let updatedRoomPricingId: number[] = [];
            let finalRoomPricingData: GuesthouseRoomPricing[] = [];
            for (const roomPricing of room.guesthouseRoomPricing) {
                if (roomPricing.id === 0) {
                    roomPricing.guesthouseRoomId = room.id;
                    newRoomPricingData.push(roomPricing);
                } else {
                    let i: number = notNewRoomPricingCount;
                    while (i <= oldRoomPricingCount) {
                        let isUpdated: boolean = false;
                        notNewRoomPricingCount++;
                        if (roomPricing.id === oldRoomData.guesthouseRoomPricing[i].id) {
                            if (roomPricing.isActive !== oldRoomData.guesthouseRoomPricing[i].isActive) {
                                isUpdated = true;
                            }
                            if (roomPricing.pricePerDay !== oldRoomData.guesthouseRoomPricing[i].pricePerDay) {
                                isUpdated = true;
                            }
                            if (roomPricing.retributionType !== oldRoomData.guesthouseRoomPricing[i].retributionType) {
                                isUpdated = true;
                            }

                            if (isUpdated) {
                                await this.guesthouseRoomRepository.updateGuesthouseRoomPricing(roomPricing, tx);
                            }
                            finalRoomPricingData.push(roomPricing);
                            updatedRoomPricingId.push(roomPricing.id);
                            break;
                        }
                        i++;
                    }
                }
            }

            let newRoomPricing: GuesthouseRoomPricing[] = [];
            if (newRoomPricingData.length > 0) {
                newRoomPricing = await this.guesthouseRoomRepository.createGuesthouseRoomPricing(newRoomPricingData, tx);
            }

            finalRoomPricingData = finalRoomPricingData.concat(newRoomPricing);

            for (const pricing of oldRoomData.guesthouseRoomPricing) {
                if (!updatedRoomPricingId.includes(pricing.id)) {
                    await this.guesthouseRoomRepository.deleteGuesthouseRoomPricingById(pricing.id, tx);
                }
            }

            let newRoomMedia: GuesthouseRoomMedia[] = [];
            if (roomMediaReq.length > 0) {
                // hash filename
                roomMediaReq = roomMediaReq.map(file => ({
                    ...file,
                    originalName: `${Date.now()}-${Math.random().toString(36).substring(7)}-${file.originalName}`,
                }));

                const roomMediaURL: string[] = await this.objectStorageService.uploadMultipleFiles(roomMediaReq, "guesthouse-media");

                // map roomMediaURL to roomMedia attribute
                newRoomMedia = roomMediaURL.map((url, index) => ({
                    id: index,
                    guesthouseRoomId: room.id,
                    url,
                }));

                newRoomMedia = await this.guesthouseRoomRepository.createGuesthouseRoomMedia(newRoomMedia, tx);
            }

            let deletedRoomMediaId: number[] = [];
            if (deletedObjectMedia.length > 0) {
                for (const media of deletedObjectMedia) {
                    const roomMedia: GuesthouseRoomMedia|null = await this.guesthouseRoomRepository.getGuesthouseRoomMediaById(media.id);
                    if (!roomMedia) {
                        throw new ResponseError("Room media not found", 404);
                    }

                    if (roomMedia.url !== media.url) {
                        throw new ResponseError("Room media not found", 400);
                    }

                    const mediaName: string = media.url.split("/").pop() as string;
                    const mediaPath: string = `guesthouse-media/${mediaName}`;
                    await this.guesthouseRoomRepository.deleteGuesthouseRoomMediaById(media.id, tx);
                    await this.objectStorageService.deleteFile(mediaPath);
                    deletedRoomMediaId.push(media.id);
                }
            }

            let finalRoomMedia: GuesthouseRoomMedia[] = [];
            for (const media of oldRoomData.guesthouseRoomMedia) {
                if (!deletedRoomMediaId.includes(media.id)) {
                    finalRoomMedia.push(media);
                }
            }
            finalRoomMedia = finalRoomMedia.concat(newRoomMedia);

            // Assign finalRoomMedia and finalRoomPricing to updatedRoom to return the complete updated data
            updatedRoom.guesthouseRoomMedia = finalRoomMedia;
            updatedRoom.guesthouseRoomPricing = finalRoomPricingData;

            return updatedRoom;
        });
    }

    public async deleteGuesthouseRoom(id: number): Promise<void> {
        const room: GuesthouseRoom|null = await this.guesthouseRoomRepository.getGuesthouseRoomById(id);

        if (!room) {
            throw new ResponseError("Guesthouse room not found", 404);
        }

        await this.guesthouseRoomRepository.deleteGuesthouseRoomById(id);

        if (room.guesthouseRoomMedia.length > 0) {
            for (const media of room.guesthouseRoomMedia) {
                const mediaName: string = media.url.split("/").pop() as string;
                const mediaPath: string = `guesthouse-media/${mediaName}`;
                await this.objectStorageService.deleteFile(mediaPath);
                await this.guesthouseRoomRepository.deleteGuesthouseRoomMediaById(media.id);
            }
        }
    }
}