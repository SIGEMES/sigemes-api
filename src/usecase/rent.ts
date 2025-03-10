import { Rent } from "../domain/entity/rent";
import { GuesthouseRoomPricing } from "../domain/entity/guesthouse-room-pricing";
import { GuesthouseRoom } from "../domain/entity/guesthouse-room";
import { ResponseError } from "../domain/error/response-error";
import { RentRepositoryInterface } from "../domain/interface/repository/rent";
import { GuesthouseRoomRepositoryInterface } from "../domain/interface/repository/guesthouse-room";
import { CityHallRepositoryInterface } from "../domain/interface/repository/city-hall";
import { DbTransactionInterface } from "../domain/interface/repository/db-transaction";
import { PaymentGatewayInterface } from "../domain/interface/external-service/payment-gateway";
import { CityHall } from "../domain/entity/city-hall";
import { CityHallPricing } from "../domain/entity/city-hall-pricing";
import { PaymentRepositoryInterface } from "../domain/interface/repository/payment";
import { Payment } from "../domain/entity/payment";
import { CryptoInterface } from "../domain/interface/library/crypto";

export class RentUsecase {
    constructor(
        private rentRepository: RentRepositoryInterface,
        private guesthouseRoomRepository: GuesthouseRoomRepositoryInterface,
        private cityHallRepository: CityHallRepositoryInterface,
        private paymentRepository: PaymentRepositoryInterface,
        private dbTransaction: DbTransactionInterface,
        private paymentGatewayService: PaymentGatewayInterface,
        private cryptoService: CryptoInterface,
    ) { }

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
            let actualTotalPrice: number = 0;
            let itemName: string = "";
            let itemType: string = "";
            let itemCategory: string = "";

            if (rent.guesthouseRoomPricingId && rent.cityHallPricingId) {
                throw new ResponseError("Please choose one of guesthouse room pricing or city hall pricing", 400);
            } else if (rent.guesthouseRoomPricingId && rent.guesthouseRoomPricingId > 0) {
                if (rent.startDate >= rent.endDate) {
                    throw new ResponseError("Start date must be before to end date", 400);
                }

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

                const rentedGuesthouseRooms: Rent[] = await this.rentRepository.getFilteredActiveRentsByGuesthouseRoomPricingIds(allGuesthouserRoomPricingIds, rent.startDate, rent.endDate);

                let bookedSlot: number = 0;
                for (const rentedRoom of rentedGuesthouseRooms) {
                    const pendingDateTime: Date = rentedRoom.payment?.paymentConfirmedAt || rentedRoom.createdAt;
                    let paymentGatewayTokenExpiry: Date = new Date(pendingDateTime);
                    paymentGatewayTokenExpiry.setDate(paymentGatewayTokenExpiry.getDate() + 1);
                    
                    if (rentedRoom.renterGender !== rent.renterGender) {
                        throw new ResponseError("Room is rented by different gender", 400);
                    }

                    if (!(rentedRoom.status === "pending" && new Date() >= paymentGatewayTokenExpiry)) {
                        bookedSlot += rentedRoom.slot;
                    }
                }

                const availableSlot: number = guesthouseRoom.totalSlot - bookedSlot;
                if (rent.slot > availableSlot) {
                    throw new ResponseError("Slot is not available", 400);
                }

                createdRent = await this.rentRepository.createRent(rent, tx);
                const daysRent: number = ((rent.endDate.getTime() - rent.startDate.getTime()) / (1000 * 60 * 60 * 24));
                actualTotalPrice = guesthouseRoomPricing.pricePerDay * daysRent;
                if (guesthouseRoomPricing.retributionType !== "Khusus Booking 1 Kamar") {
                    actualTotalPrice *= rent.slot;
                }

                itemName = guesthouseRoom.name;
                itemType = "Kamar Mess";
                itemCategory = guesthouseRoomPricing.retributionType;

            } else if (rent.cityHallPricingId && rent.cityHallPricingId > 0) {

                if (rent.startDate > rent.endDate) {
                    throw new ResponseError("Start date must be before or equal to end date", 400);
                }

                const twoWeeksFromNow: Date = new Date();
                twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 14);
                if (rent.startDate > twoWeeksFromNow) {
                    throw new ResponseError("Start date must be within the next 2 weeks", 400);
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
                const rentedCityHalls: Rent[] = await this.rentRepository.getFilteredActiveRentsByCityHallPricingIds(allCityHallPricingIds, rent.startDate, rent.endDate);
                for (const rentedCityHall of rentedCityHalls) {
                    let paymentGatewayTokenExpiry: Date = new Date(rentedCityHall.createdAt);
                    paymentGatewayTokenExpiry.setDate(paymentGatewayTokenExpiry.getDate() + 1);

                    if (!(rentedCityHall.status === "pending" && new Date() >= paymentGatewayTokenExpiry)) {
                        throw new ResponseError("City hall is not available", 400);
                    }
                }

                createdRent = await this.rentRepository.createRent(rent, tx);
                const daysRent: number = ((rent.endDate.getTime() - rent.startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
                actualTotalPrice = cityHallPricing.pricePerDay * daysRent;

                itemName = cityHall.name;
                itemType = "Gedung Nasional";
                itemCategory = cityHallPricing.activityType;
            } else {
                throw new ResponseError("Bad request", 400);
            }

            if (actualTotalPrice <= 0) {
                throw new ResponseError("Unexpected error", 500);
            }

            const paymentGatewayTransactionFee: number = 5550;
            const totalPrice: number = Math.ceil(actualTotalPrice + paymentGatewayTransactionFee);


            if (!createdRent.renter) {
                throw new ResponseError("Renter not found", 404);
            }

            const renterEmail: string = createdRent.renter.email;
            const renterName: string = createdRent.renter.fullname;
            const renterPhone: string = createdRent.renter.phoneNumber;

            const newPaymentId: string = this.cryptoService.generateUUIDv4();
            const token: string = await this.paymentGatewayService.createTransaction(newPaymentId, renterName, renterEmail, renterPhone, itemName, itemType, itemCategory, totalPrice, actualTotalPrice, paymentGatewayTransactionFee);
            if (!token) {
                throw new ResponseError("Failed to create transaction", 500);
            }

            const createdPayment: Payment = await this.paymentRepository.createPayment({
                id: newPaymentId,
                rentId: createdRent.id,
                amount: actualTotalPrice,
                method: null,
                status: "pending",
                paymentGatewayToken: token,
                paymentTriggeredAt: null,
                paymentConfirmedAt: null,
            }, tx);

            createdRent.payment = createdPayment;

            return createdRent;
        });
    }

    public async cancelRent(rentId: number, userId: number, userRole: string): Promise<Rent> {
        const rent: Rent = await this.rentRepository.getRentById(rentId);

        if (!rent) {
            throw new ResponseError("Rent not found", 404);
        }

        if (userRole === "renter") {
            if (rent.renterId !== userId) {
                throw new ResponseError("You are not authorized to cancel this rent", 403);
            }
            if (rent.status !== "pending") {
                throw new ResponseError("Rent cannot be cancelled", 400);
            }
        }

        // Using transaction to ensure data consistency
        return await this.dbTransaction.run(async (tx) => {
            if (!rent.payment?.id) {
                throw new ResponseError("Payment not found", 404);
            }
            
            await this.paymentRepository.updatePaymentStatus(rent.payment?.id, "gagal", tx);
            const updatedRent: Rent = await this.rentRepository.updateRentStatus(rentId, "dibatalkan", tx);
            if (rent.payment.paymentTriggeredAt) {
                await this.paymentGatewayService.cancelTransaction(rent.payment.id);
            }

            return updatedRent;
        });
    }

    public async checkInRent(rentId: number): Promise<Rent> {
        const rent: Rent = await this.rentRepository.getRentById(rentId);

        if (!rent) {
            throw new ResponseError("Rent not found", 404);
        }

        if (rent.status !== "dikonfirmasi") {
            throw new ResponseError("Rent cannot be checked in", 400);
        }

        if (new Date() < rent.startDate) {
            throw new ResponseError("Rent cannot be checked in yet", 400);
        }

        return await this.rentRepository.updateRentCheckIn(rentId);
    }

    public async checkOutRent(rentId: number): Promise<Rent> {
        const rent: Rent = await this.rentRepository.getRentById(rentId);

        if (!rent) {
            throw new ResponseError("Rent not found", 404);
        }

        if (rent.status !== "dikonfirmasi" || !rent.checkIn) {
            throw new ResponseError("Rent cannot be checked out", 400);
        }

        return await this.rentRepository.updateRentCheckOut(rentId);
    }
}