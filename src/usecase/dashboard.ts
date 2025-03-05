import { RentRepositoryInterface } from "../domain/interface/repository/rent";
import { PaymentRepositoryInterface } from "../domain/interface/repository/payment";

export class DashboardUsecase {
    constructor(
        private rentRepository: RentRepositoryInterface,
        private paymentRepository: PaymentRepositoryInterface
    ) {}

    public async getDailyRevenue(date: Date): Promise<number> {
        const startOfDay = new Date(date.setHours(0, 0, 0, 0));
        const endOfDay = new Date(date.setHours(23, 59, 59, 999));

        return await this.paymentRepository.getRevenue(startOfDay, endOfDay);
    }

    public async getMonthlyRevenue(date: Date): Promise<number> {
        const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);

        return await this.paymentRepository.getRevenue(startOfMonth, endOfMonth);
    }

    public async getAnnualRevenue(date: Date): Promise<number> {
        const startOfYear = new Date(date.getFullYear(), 0, 1);
        const endOfYear = new Date(date.getFullYear(), 11, 31, 23, 59, 59, 999);

        return await this.paymentRepository.getRevenue(startOfYear, endOfYear);
    }
}
