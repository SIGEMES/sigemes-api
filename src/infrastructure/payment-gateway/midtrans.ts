import { MidtransClient } from 'midtrans-node-client';
import { PaymentGatewayInterface } from '../../domain/interface/external-service/payment-gateway';

const snap: MidtransClient.Snap = new MidtransClient.Snap({
    isProduction: process.env.IS_PRODUCTION === "true",
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY
});

export class MidtransService implements PaymentGatewayInterface {
    async createTransaction(
        orderId: string,
        customer_name: string,
        customer_email: string,
        customer_phone: string,
        item_name: string,
        item_brand: string,
        item_category: string,
        grossAmount: number,
        actualAmount: number,
        transactionFee: number,
    ): Promise<string> {
        const response = await snap.createTransaction({
            transaction_details: {
                order_id: orderId,
                gross_amount: grossAmount
            },
            customer_details: {
                first_name: customer_name,
                phone: customer_phone,
                email: customer_email
            },
            item_details: [
                {
                    price: actualAmount,
                    quantity: 1,
                    name: item_name,
                    brand: item_brand,
                    category: item_category
                },
                {
                    price: transactionFee,
                    quantity: 1,
                    name: 'Biaya Layanan',
                },
            ]
        });

        console.log(response);

        return response.token;
    }
}