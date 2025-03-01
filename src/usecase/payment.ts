import { Payment } from "../domain/entity/payment";
import { PaymentRepositoryInterface } from "../domain/interface/repository/payment";
import { ResponseError } from "../domain/error/response-error";
import { PaymentGatewayNotification } from "../domain/entity/payment-gateway-notification";
import { RentRepositoryInterface } from "../domain/interface/repository/rent";
import { DbTransactionInterface } from "../domain/interface/repository/db-transaction";

export class PaymentUsecase {
    constructor(
        private paymentRepository: PaymentRepositoryInterface,
        private rentRepository: RentRepositoryInterface,
        private dbTransaction: DbTransactionInterface,
    ) {}

    public async handlePaymentNotification(paymentNotification: PaymentGatewayNotification): Promise<void> {
        const payment: Payment | null = await this.paymentRepository.findPaymentById(paymentNotification.orderId);

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
}