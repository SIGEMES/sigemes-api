import { Payment } from "../domain/entity/payment";
import { PaymentRepositoryInterface } from "../domain/interface/repository/payment";
import { ResponseError } from "../domain/error/response-error";
import { PaymentGatewayNotification } from "../domain/entity/payment-gateway-notification";
import { RentRepositoryInterface } from "../domain/interface/repository/rent";
import { DbTransactionInterface } from "../domain/interface/repository/db-transaction";
import { PaymentGatewayInterface } from "../domain/interface/external-service/payment-gateway";
import { Rent } from "../domain/entity/rent";
import { GuesthouseRoomPricing } from "../domain/entity/guesthouse-room-pricing";
import { GuesthouseRoom } from "../domain/entity/guesthouse-room";
import { CityHallPricing } from "../domain/entity/city-hall-pricing";
import { CityHall } from "../domain/entity/city-hall";
import { CryptoInterface } from "../domain/interface/library/crypto";

export class PaymentUsecase {
    constructor(
        private paymentRepository: PaymentRepositoryInterface,
        private rentRepository: RentRepositoryInterface,
        private dbTransaction: DbTransactionInterface,
        private paymentGatewayService: PaymentGatewayInterface,
        private cryptoService: CryptoInterface,
    ) { }

    public async handlePaymentNotification(paymentNotification: PaymentGatewayNotification): Promise<void> {
        const payment: Payment | null = await this.paymentRepository.getPaymentById(paymentNotification.orderId);

        if (!payment) {
            throw new ResponseError("Payment not found", 404);
        }

        return await this.dbTransaction.run(async (tx) => {
            if (paymentNotification.transactionStatus === "pending") {
                if (paymentNotification.transactionTime) {
                    await this.paymentRepository.updatePaymentMethodStatusTriggeredAt(paymentNotification.orderId, paymentNotification.paymentType, "pending", paymentNotification.transactionTime, tx);
                } else {
                    throw new ResponseError("Transaction time is null", 400);
                }
            } else if (paymentNotification.transactionStatus === "settlement") {
                if (paymentNotification.settlementTime) {
                    await this.paymentRepository.updatePaymentStatusConfirmedAt(paymentNotification.orderId, "dibayar", paymentNotification.settlementTime, tx);
                    await this.rentRepository.updateRentStatus(payment.rentId, "dikonfirmasi", tx);
                } else {
                    throw new ResponseError("Settlement time is null", 400);
                }
            } else if (paymentNotification.transactionStatus === "expire" || paymentNotification.transactionStatus === "cancel" || paymentNotification.transactionStatus === "deny") {
                await this.paymentRepository.updatePaymentStatus(paymentNotification.orderId, "gagal", tx);
                await this.rentRepository.updateRentStatus(payment.rentId, "dibatalkan", tx);
            } else {
                throw new ResponseError("Internal server error", 500);
            }
        });
    }

    public async renewPaymentGatewayToken(rentId: number, renterId: number): Promise<Payment> {
        return await this.dbTransaction.run(async (tx) => {
            const rent: Rent|null = await this.rentRepository.getRentById(rentId);
            if (!rent) {
                throw new ResponseError("Rent not found", 404);
            }

            if (rent.renterId !== renterId) {
                throw new ResponseError("Unauthorized", 401);
            }

            let actualTotalPrice: number = 0;
            let itemName: string = "";
            let itemType: string = "";
            let itemCategory: string = "";

            if (rent.guesthouseRoomPricing !== null) {
                const guesthouseRoomPricing: GuesthouseRoomPricing = rent.guesthouseRoomPricing;
                const guesthouseRoom: GuesthouseRoom = guesthouseRoomPricing.guesthouseRoom;
                const daysRent: number = ((rent.endDate.getTime() - rent.startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
                
                actualTotalPrice = guesthouseRoomPricing.pricePerDay * daysRent;
                if (guesthouseRoomPricing.retributionType !== "Khusus Booking 1 Kamar") {
                    actualTotalPrice *= rent.slot;
                }
                itemName = guesthouseRoom.name;
                itemType = "Kamar Mess";
                itemCategory = guesthouseRoomPricing.retributionType;

            } else if (rent.cityHallPricing !== null) {
                const cityHallPricing: CityHallPricing = rent.cityHallPricing;
                const cityHall: CityHall = cityHallPricing.cityHall;
                const daysRent: number = ((rent.endDate.getTime() - rent.startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
                
                actualTotalPrice = cityHallPricing.pricePerDay * daysRent;
                itemName = cityHall.name;
                itemType = "Gedung Nasional";
                itemCategory = cityHallPricing.activityType;
            } else {
                throw new ResponseError("Rent pricing not found", 404);
            }

            const paymentGatewayTransactionFee: number = 5000;
            const tax: number = 0.11 * paymentGatewayTransactionFee;
            const totalPrice: number = Math.ceil(actualTotalPrice + tax + paymentGatewayTransactionFee);

            if (!rent.renter) {
                throw new ResponseError("Renter not found", 404);
            }

            const newPaymentId: string = this.cryptoService.generateUUIDv4();
            const renterEmail: string = rent.renter.email;
            const renterName: string = rent.renter.fullname;
            const renterPhone: string = rent.renter.phoneNumber;
            const token: string = await this.paymentGatewayService.createTransaction(newPaymentId, renterName, renterEmail, renterPhone, itemName, itemType, itemCategory, totalPrice, actualTotalPrice, tax, paymentGatewayTransactionFee);
            if (!token) {
                throw new ResponseError("Failed to create transaction", 500);
            }

            if (rent.payment === null) {
                throw new ResponseError("Rent payment not found", 404);
            }

            const updatedPayment: Payment = await this.paymentRepository.updatePaymentIdToken(rent.payment.id, newPaymentId, token, tx);
            return updatedPayment;
        });
    }
}