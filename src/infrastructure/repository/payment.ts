import { PrismaClient } from "@prisma/client";
import { Payment, PaymentStatus } from "../../domain/entity/payment";
import { PaymentRepositoryInterface } from "../../domain/interface/repository/payment";
import { randomUUID } from "crypto";

export class PaymentRepository implements PaymentRepositoryInterface {
    constructor(private prisma: PrismaClient) {}

    public async getPaymentById(paymentId: string): Promise<Payment | null> {
        const payment: Payment | null = await this.prisma.payment.findUnique({
            where: {
                id: paymentId
            }
        });

        return payment;
    }

    public async createPayment(payment: Payment, transaction: any): Promise<Payment> {
        const prisma = transaction || this.prisma;

        const createdPayment: Payment = await prisma.payment.create({
            data: {
                rentId: payment.rentId,
                amount: payment.amount,
                method: payment.method,
                status: payment.status,
                paymentGatewayToken: payment.paymentGatewayToken,
                paymentTriggeredAt: payment.paymentTriggeredAt,
                paymentConfirmedAt: payment.paymentConfirmedAt
            }
        });

        return createdPayment;
    }

    public async updatePaymentIdToken(oldId: string, newId: string, paymentGatewayToken: string, transaction?: any): Promise<Payment> {
        const prisma = transaction || this.prisma;

        const updatedPayment: Payment = await prisma.payment.update({
            where: {
                id: oldId
            },
            data: {
                id: newId,
                paymentGatewayToken: paymentGatewayToken
            }
        });

        return updatedPayment;
    }

    public async updatePaymentMethodStatusTriggeredAt(paymentId: string, method: string, status: PaymentStatus, paymentTriggeredAt: Date, transaction?: any): Promise<Payment> {
        const prisma = transaction || this.prisma;
        
        const updatedPayment: Payment = await prisma.payment.update({
            where: {
                id: paymentId
            },
            data: {
                method: method,
                status: status,
                paymentTriggeredAt: paymentTriggeredAt
            }
        });

        return updatedPayment;
    }

    public async updatePaymentStatusConfirmedAt(paymentId: string, status: PaymentStatus, paymentConfirmedAt: Date, transaction?: any): Promise<Payment> {
        const prisma = transaction || this.prisma;

        const updatedPayment: Payment = await prisma.payment.update({
            where: {
                id: paymentId
            },
            data: {
                status: status,
                paymentConfirmedAt: paymentConfirmedAt
            }
        });

        return updatedPayment;
    }

    public async updatePaymentStatus(paymentId: string, status: PaymentStatus, transaction?: any): Promise<Payment> {
        const prisma = transaction || this.prisma;

        const updatedPayment: Payment = await prisma.payment.update({
            where: {
                id: paymentId
            },
            data: {
                status: status
            }
        });

        return updatedPayment;
    }
}