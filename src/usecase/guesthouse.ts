import { Guesthouse } from "../domain/entity/guesthouse";
import { GuesthouseMedia } from "../domain/entity/guesthouse-media";
import { ResponseError } from "../domain/error/response-error";
import { File } from "../domain/interface/library/file";
import { GuesthouseRepositoryInterface } from "../domain/interface/repository/guesthouse";
import { ObjectStorageInterface } from "../domain/interface/external-service/object-storage";
import { DbTransactionInterface } from "../domain/interface/repository/db-transaction";

export class GuesthouseUsecase {
    constructor (
        private guesthouseRepository: GuesthouseRepositoryInterface,
        private objectStorageService: ObjectStorageInterface,
        private dbTransaction: DbTransactionInterface,
    ) {}

    public async getAllGuesthouses(): Promise<Guesthouse[]> {
        const guesthouses: Guesthouse[] = await this.guesthouseRepository.getAllGuesthouses();

        return guesthouses;
    }
    
    public async getGuesthouseById(id: number): Promise<Guesthouse> {
        const guesthouse: Guesthouse|null = await this.guesthouseRepository.getGuesthouseById(id);

        if (!guesthouse) {
            throw new ResponseError("Guesthouse not found", 404);
        }

        return guesthouse;
    }

    public async createGuesthouse(guesthouse: Guesthouse, guesthouseMedia: File[]): Promise<Guesthouse> {
        // hash filename
        guesthouseMedia = guesthouseMedia.map(file => ({
            ...file,
            originalName: `${Date.now()}-${Math.random().toString(36).substring(7)}-${file.originalName}`,
        }));

        const guesthouseMediaURL: string[] = await this.objectStorageService.uploadMultipleFiles(guesthouseMedia, "guesthouse-media");

        // map guesthouseMediaURL to guesthouseMedia attribute
        guesthouse.guesthouseMedia = guesthouseMediaURL.map((url, index) => ({
            id: index,
            guesthouseId: guesthouse.id,
            url,
        }));

        const newGuesthouse: Guesthouse = await this.guesthouseRepository.createGuesthouse(guesthouse);

        return newGuesthouse;
    }

    public async updateGuesthouse(id: number, guesthouse: Guesthouse, newGuesthouseMedia: File[], deletedGuesthouseMedia: GuesthouseMedia[]): Promise<Guesthouse> {
        // Using transaction to ensure data consistency
        return await this.dbTransaction.run(async (tx) => {
            const oldGuesthouseData: Guesthouse|null = await this.guesthouseRepository.getGuesthouseById(id);

            if (!oldGuesthouseData) {
                throw new ResponseError("Guesthouse not found", 404);
            }

            const updatedGuesthouse: Guesthouse = await this.guesthouseRepository.updateGuesthouseOnly(id, guesthouse);


            let newGuesthouseMediaData: GuesthouseMedia[] = [];
            if (newGuesthouseMedia.length > 0) {
                // hash filename
                newGuesthouseMedia = newGuesthouseMedia.map(file => ({
                    ...file,
                    originalName: `${Date.now()}-${Math.random().toString(36).substring(7)}-${file.originalName}`,
                }));

                const newGuesthouseMediaURL: string[] = await this.objectStorageService.uploadMultipleFiles(newGuesthouseMedia, "guesthouse-media");

                // map newGuesthouseMediaURL to newGuesthouseMedia attribute
                newGuesthouseMediaData = newGuesthouseMediaURL.map((url, index) => ({
                    id: index,
                    guesthouseId: id,
                    url,
                }));

                newGuesthouseMediaData = await this.guesthouseRepository.createGuesthouseMedia(newGuesthouseMediaData, tx);
            }

            let deletedImageId: number[] = [];
            if (deletedGuesthouseMedia.length > 0) {
                for (const media of deletedGuesthouseMedia) {
                    const guesthouseMedia: GuesthouseMedia|null = await this.guesthouseRepository.getGuesthouseMediaById(media.id);
                    if (!guesthouseMedia) {
                        throw new ResponseError("Guesthouse media not found", 404);
                    }

                    if (guesthouseMedia.url !== media.url) {
                        throw new ResponseError("Guesthouse media not found", 400);
                    }

                    const mediaName: string = media.url.split("/").pop() as string;
                    const mediaPath: string = `guesthouse-media/${mediaName}`;
                    await this.guesthouseRepository.deleteGuesthouseMedia(media.id, tx);
                    await this.objectStorageService.deleteFile(mediaPath);
                    deletedImageId.push(media.id);
                }
            }

            let finalGuesthouseMedia: GuesthouseMedia[] = [];
            for (const media of updatedGuesthouse.guesthouseMedia) {
                if (!deletedImageId.includes(media.id)) {
                    finalGuesthouseMedia.push(media);
                }
            }
            finalGuesthouseMedia = finalGuesthouseMedia.concat(newGuesthouseMediaData);

            // Assign finalGuesthouseMedia to updatedGuesthouse to return the complete updated data
            updatedGuesthouse.guesthouseMedia = finalGuesthouseMedia;

            return updatedGuesthouse;
        });
    }

}