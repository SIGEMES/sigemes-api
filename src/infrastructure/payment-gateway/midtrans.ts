import { MidtransClient } from 'midtrans-node-client';
import { PaymentGatewayInterface } from '../../domain/interface/external-service/payment-gateway';

const snap: MidtransClient.Snap = new MidtransClient.Snap({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY
});

export class MidtransService implements PaymentGatewayInterface {
    async createTransaction(orderId: string, grossAmount: number): Promise<string> {
        console.log(snap.apiConfig)
        const response = await snap.createTransaction({
            transaction_details: {
                order_id: orderId,
                gross_amount: grossAmount
            }
        });

        console.log(response);

        return response.token;
    }
}