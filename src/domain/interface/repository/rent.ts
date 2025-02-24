import { Rent } from "../../entity/rent";

export interface RentRepositoryInterface {
    getAllRents(): Promise<Rent[]>;
    getAllRentsByRenterId(renterId: number): Promise<Rent[]>;
    getRentById(rentId: number): Promise<Rent>;
}