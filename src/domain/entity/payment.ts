export type PaymentStatus = 'pending' | 'dibayar' | 'gagal';

export class Payment {
    constructor (
        public id: string = '',
        public rentId: number = 0,
        public amount: number = 0,
        public method: string | null = null,
        public status: PaymentStatus = 'pending',
        public paymentGatewayToken: string|null = null,
        public paymentTriggeredAt: Date|null = null,
        public paymentConfirmedAt: Date|null = null,
    ) {}
}