import { Payment, PaymentStatus } from "../../entity/payment";

export interface PaymentRepositoryInterface {
    findPaymentById(paymentId: string): Promise<Payment | null>;
    createPayment(payment: Payment, transaction: any): Promise<Payment>;
    updatePaymentMethodStatusTriggeredAt(paymentId: string, method: string, status: PaymentStatus, paymentTriggeredAt: Date, transaction?: any): Promise<Payment>;
    updatePaymentStatusConfirmedAt(paymentId: string, status: PaymentStatus, paymentConfirmedAt: Date, transaction?: any): Promise<Payment>;
    updatePaymentStatus(paymentId: string, status: PaymentStatus, transaction?: any): Promise<Payment>;
}