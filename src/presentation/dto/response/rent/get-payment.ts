import { Payment } from "../../../../domain/entity/payment";

export class GetPaymentResponse {
    constructor(
        public id: string,
        public rent_id: number,
        public amount: number,
        public method: string | null,
        public status: string,
        public payment_gateway_token: string | null,
        public payment_triggered_at: Date | null,
        public payment_confirmed_at: Date | null,
    ) {}

    public static fromEntity(payment: Payment | null): GetPaymentResponse | null {
        if (!payment) return null;

        return new GetPaymentResponse(
            payment.id,
            payment.rentId,
            payment.amount,
            payment.method,
            payment.status,
            payment.paymentGatewayToken,
            payment.paymentTriggeredAt,
            payment.paymentConfirmedAt,
        );
    }
}