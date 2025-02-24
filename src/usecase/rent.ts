import { Rent } from "../domain/entity/rent";
import { ResponseError } from "../domain/error/response-error";
import { RentRepositoryInterface } from "../domain/interface/repository/rent";
import { GuesthouseRoomRepositoryInterface } from "../domain/interface/repository/guesthouse-room";
import { CityHallRepositoryInterface } from "../domain/interface/repository/city-hall";
import { DbTransactionInterface } from "../domain/interface/repository/db-transaction";

export class RentUsecase {
    constructor(
        private rentRepository: RentRepositoryInterface,
        private guesthouseRoomRepository: GuesthouseRoomRepositoryInterface,
        private cityHallRepository: CityHallRepositoryInterface,
        private dbTransaction: DbTransactionInterface,
    ) {}

    public async getAllRents(userId: number, userRole: string): Promise<Rent[]> {
        if (userRole === "renter") {
            return this.rentRepository.getAllRentsByRenterId(userId);
        }

        return this.rentRepository.getAllRents();
    }

    public async getRentById(rentId: number, userId: number, userRole: string): Promise<Rent> {
        const rent: Rent = await this.rentRepository.getRentById(rentId);

        if (!rent) {
            throw new ResponseError("Rent not found", 404);
        }

        if (userRole === "renter" && rent.renterId !== userId) {
            throw new ResponseError("You are not authorized to access this rent data", 403);
        }

        return rent;
    }
}