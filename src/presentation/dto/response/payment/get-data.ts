import { Payment } from "../../../../domain/entity/payment";

export class PaymentResponse {
    constructor(
        public id: string,
        public rentId: number,
        public amount: number,
        public method: string | null,
        public status: string,
        public paymentGatewayToken: string | null,
        public paymentTriggeredAt: Date | null,
        public paymentConfirmedAt: Date | null
    ) { }

    public static fromEntity(payment: Payment): PaymentResponse {
        return new PaymentResponse(
            payment.id,
            payment.rentId,
            payment.amount,
            payment.method,
            payment.status,
            payment.paymentGatewayToken,
            payment.paymentTriggeredAt,
            payment.paymentConfirmedAt
        );
    }
}