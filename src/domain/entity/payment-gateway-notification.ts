export class PaymentGatewayNotification {
    constructor(
        public transactionId: string = '',
        public transactionTime: Date| null = null,
        public transactionStatus: string = '',
        public statusCode: string = '',
        public statusMessage: string = '',
        public signatureKey: string = '',
        public paymentType: string = '',
        public orderId: string = '',
        public grossAmount: number = 0,
        public settlementTime: Date| null = null,
        public expiryTime: Date| null = null,
    ) {}
}