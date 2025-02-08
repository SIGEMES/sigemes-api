export interface DbTransactionInterface {
    run<T>(callback: (transaction: any) => Promise<T>): Promise<T>;
}