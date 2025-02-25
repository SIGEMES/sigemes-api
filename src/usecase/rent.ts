import { Rent } from "../domain/entity/rent";
import { GuesthouseRoomPricing } from "../domain/entity/guesthouse-room-pricing";
import { GuesthouseRoom } from "../domain/entity/guesthouse-room";
import { ResponseError } from "../domain/error/response-error";
import { RentRepositoryInterface } from "../domain/interface/repository/rent";
import { GuesthouseRoomRepositoryInterface } from "../domain/interface/repository/guesthouse-room";
import { CityHallRepositoryInterface } from "../domain/interface/repository/city-hall";
import { DbTransactionInterface } from "../domain/interface/repository/db-transaction";
import { CityHall } from "../domain/entity/city-hall";
import { CityHallPricing } from "../domain/entity/city-hall-pricing";

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

    public async createRent(rent: Rent): Promise<Rent> {
        // Using transaction to ensure data consistency
        return await this.dbTransaction.run(async (tx) => {
            let createdRent: Rent;

            if (rent.guesthouseRoomPricingId && rent.cityHallPricingId) {
                throw new ResponseError("Please choose one of guesthouse room pricing or city hall pricing", 400);
            } else if (rent.guesthouseRoomPricingId) {
                const guesthouseRoomPricing: GuesthouseRoomPricing | null = await this.guesthouseRoomRepository.getGuesthouseRoomPricingById(rent.guesthouseRoomPricingId);
                if (!guesthouseRoomPricing) {
                    throw new ResponseError("Guesthouse room pricing not found", 404);
                }

                if (guesthouseRoomPricing.isActive === false) {
                    throw new ResponseError("Guesthouse room pricing is not available", 400);
                }

                const guesthouseRoom: GuesthouseRoom | null = await this.guesthouseRoomRepository.getGuesthouseRoomById(guesthouseRoomPricing.guesthouseRoomId);
                if (!guesthouseRoom) {
                    throw new ResponseError("Guesthouse room not found", 404);
                }

                let allGuesthouserRoomPricingIds: number[] = guesthouseRoom.guesthouseRoomPricing.map((pricing) => pricing.id);

                const rentedGuesthouseRooms = await this.rentRepository.getActiveRentsByGuesthouseRoomPricingIds(allGuesthouserRoomPricingIds);

                let bookedSlot = 0;
                rentedGuesthouseRooms.forEach(({ startDate, endDate, checkOut, slot, renterGender }) => {
                    const actualEndDate = checkOut || endDate;

                    const isOverlapping =
                        (startDate <= rent.startDate && actualEndDate >= rent.startDate) ||
                        (startDate >= rent.startDate && startDate <= rent.endDate) ||
                        (startDate <= rent.startDate && actualEndDate >= rent.endDate);

                    if (isOverlapping) {
                        bookedSlot += slot;

                        if (renterGender !== rent.renterGender) {
                            throw new ResponseError("Room is rented by different gender", 400);
                        }
                    }
                });


                const availableSlot = guesthouseRoom.totalSlot - bookedSlot;
                if (rent.slot > availableSlot) {
                    throw new ResponseError("Slot is not available", 400);
                }

                createdRent = await this.rentRepository.createRent(rent, tx);
                return createdRent;

            } else if (rent.cityHallPricingId) {
                const oneWeekFromNow: Date = new Date();
                oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);

                if (rent.startDate > rent.endDate) {
                    throw new ResponseError("Start date must be less than end date", 400);
                }

                if (rent.startDate < oneWeekFromNow) {
                    throw new ResponseError("Start date must be at least 1 week from now", 400);
                }

                const cityHallPricing: CityHallPricing | null = await this.cityHallRepository.getCityHallPricingById(rent.cityHallPricingId);
                if (!cityHallPricing) {
                    throw new ResponseError("City hall pricing not found", 404);
                }

                const cityHall: CityHall | null = await this.cityHallRepository.getCityHallById(cityHallPricing.cityHallId);
                if (!cityHall) {
                    throw new ResponseError("City hall not found", 404);
                }

                let allCityHallPricingIds: number[] = cityHall.cityHallPricing.map((pricing) => pricing.id);
                const rentedCityHalls = await this.rentRepository.getActiveRentsByCityHallPricingIds(allCityHallPricingIds);
                rentedCityHalls.forEach(({ startDate, endDate, checkOut }) => {
                    const actualEndDate = checkOut || endDate;

                    const isOverlapping =
                        (startDate <= rent.startDate && actualEndDate >= rent.startDate) ||
                        (startDate >= rent.startDate && startDate <= rent.endDate) ||
                        (startDate <= rent.startDate && actualEndDate >= rent.endDate);

                    if (isOverlapping) {
                        throw new ResponseError("City hall is not available", 400);
                    }
                });

                createdRent = await this.rentRepository.createRent(rent);

            } else {
                throw new ResponseError("Bad request", 400);
            }

            return createdRent;
        });

    }
}