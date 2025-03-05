import { Guesthouse } from "../../entity/guesthouse";
import { GuesthouseMedia } from "../../entity/guesthouse-media";

export interface GuesthouseRepositoryInterface {
    getAllGuesthouses(): Promise<Guesthouse[]>;
    getGuesthouseById(id: number): Promise<Guesthouse|null>;
    getGuesthouseMediaById(id: number): Promise<GuesthouseMedia|null>;
    createGuesthouse(guesthouse: Guesthouse, transaction?: any): Promise<Guesthouse>;
    createGuesthouseMedia(guesthouseMedia: GuesthouseMedia[], transaction?: any): Promise<GuesthouseMedia[]>;
    updateGuesthouseOnly(id: number, guesthouse: Guesthouse, transaction?: any): Promise<Guesthouse>;
    deleteGuesthouseMedia(id: number, transaction?: any): Promise<void>;
    deleteGuesthouse(id: number): Promise<void>;
    getAllGuesthousesWithPricing(): Promise<Guesthouse[]>;
}