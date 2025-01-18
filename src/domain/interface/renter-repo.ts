import { Renter } from "../entity/renter";

export interface RenterRepoInterface {
    getUserByEmail(email: string): Promise<Renter|null>;
}