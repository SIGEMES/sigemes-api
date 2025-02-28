export interface PaymentGatewayInterface {
    createTransaction(orderId: string, grossAmount: number): Promise<string>;
}