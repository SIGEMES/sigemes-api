import { Payment, PaymentStatus } from "../../entity/payment";

export interface PaymentRepositoryInterface {
    getPaymentById(paymentId: string): Promise<Payment | null>;
    createPayment(payment: Payment, transaction: any): Promise<Payment>;
    updatePaymentIdToken(oldId: string, newId:string, paymentGatewayToken: string, transaction?: any): Promise<Payment>;
    updatePaymentMethodStatusTriggeredAt(paymentId: string, method: string, status: PaymentStatus, paymentTriggeredAt: Date, transaction?: any): Promise<Payment>;
    updatePaymentStatusConfirmedAt(paymentId: string, status: PaymentStatus, paymentConfirmedAt: Date, transaction?: any): Promise<Payment>;
    updatePaymentStatus(paymentId: string, status: PaymentStatus, transaction?: any): Promise<Payment>;
    getRevenue(start: Date, end: Date): Promise<number>;
    getRevenueAndCountByGuesthousePricingIds(guesthousePricingIds: number[], start: Date, end: Date): Promise<{ revenue: number, count: number }>;
    getRevenueAndCountByCityHallPricingIds(cityHallPricingIds: number[], start: Date, end: Date): Promise<{ revenue: number, count: number }>;
}