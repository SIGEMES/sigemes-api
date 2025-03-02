import { Request, Response, NextFunction } from 'express';
import { Payment } from '../../domain/entity/payment';
import { PaymentUsecase } from '../../usecase/payment';
import { BaseSuccessResponse } from '../dto/response/base/base-success';
import { PaymentGatewayNotificationRequest } from '../dto/request/payment/payment-gateway-notification';
import { PaymentResponse } from '../dto/response/payment/get-data';
import { PaymentValidation } from '../validation/payment';

export class PaymentController {
    constructor(private paymentUsecase: PaymentUsecase) { }

    public async handlePaymentNotification(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const paymentNotification: PaymentGatewayNotificationRequest = req.body;
            const paymentNotificationEntity = PaymentGatewayNotificationRequest.toEntity(paymentNotification);
            await this.paymentUsecase.handlePaymentNotification(paymentNotificationEntity);
            res.status(200).json(new BaseSuccessResponse(true, "Handle payment notification success", null));
        } catch (error) {
            next(error);
        }
    }

    public async renewPaymentGatewayToken(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id: rentId } = PaymentValidation.id.parse({ id: Number(req.params.id) });
            const renterId: number = res.locals.user.id;
            const payment: Payment = await this.paymentUsecase.renewPaymentGatewayToken(rentId, renterId);
            const paymentResponse: PaymentResponse = PaymentResponse.fromEntity(payment);
            res.status(200).json(new BaseSuccessResponse(true, "Renew payment gateway token success", paymentResponse));
        } catch (error) {
            next(error);
        }
    }
}