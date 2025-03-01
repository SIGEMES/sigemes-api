import { Request, Response, NextFunction } from 'express';
import { Payment } from '../../domain/entity/payment';
import { PaymentUsecase } from '../../usecase/payment';
import { BaseSuccessResponse } from '../dto/response/base/base-success';
import { PaymentGatewayNotificationRequest } from '../dto/request/payment/payment-gateway-notification';

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
}