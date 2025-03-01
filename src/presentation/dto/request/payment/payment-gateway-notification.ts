import { PaymentGatewayNotification } from "../../../../domain/entity/payment-gateway-notification";

export class PaymentGatewayNotificationRequest {
    constructor(
        public transaction_id: string,
        public transaction_time: string | null,
        public transaction_status: string,
        public status_code: string,
        public status_message: string,
        public signature_key: string,
        public payment_type: string,
        public order_id: string,
        public gross_amount: number,
        public settlement_time: string | null,
        public expiry_time: string | null,
    ) {}

    private static convertToUTC(dateString: string | null): Date | null {
        if (!dateString) return null;
        
        const localDate = new Date(dateString.replace(" ", "T") + "+07:00");
        return new Date(localDate.toISOString());
    }

    public static toEntity(data: PaymentGatewayNotificationRequest): PaymentGatewayNotification {
        return new PaymentGatewayNotification(
            data.transaction_id,
            this.convertToUTC(data.transaction_time),
            data.transaction_status,
            data.status_code,
            data.status_message,
            data.signature_key,
            data.payment_type,
            data.order_id,
            data.gross_amount,
            this.convertToUTC(data.settlement_time),
            this.convertToUTC(data.expiry_time),
        );
    }
}
