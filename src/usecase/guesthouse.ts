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
}