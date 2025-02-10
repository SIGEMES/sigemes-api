import { Guesthouse } from "../../entity/guesthouse";

export interface GuesthouseRepositoryInterface {
    getAllGuesthouses(): Promise<Guesthouse[]>;
    getGuesthouseById(id: number): Promise<Guesthouse|null>;
    createGuesthouse(guesthouse: Guesthouse): Promise<Guesthouse>;
    // updateGuesthouse(id: number, guesthouse: Guesthouse): Promise<Guesthouse>;
    // deleteGuesthouse(id: number): Promise<Guesthouse>;
}