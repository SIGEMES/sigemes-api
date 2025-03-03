import { RentRepositoryInterface } from "../domain/interface/repository/rent";
import { PaymentRepositoryInterface } from "../domain/interface/repository/payment";

export class DashboardUsecase {
    constructor(
        private rentRepository: RentRepositoryInterface,
        private paymentRepository: PaymentRepositoryInterface
    ) {}

    public async getRevenueSummary(): Promise<{ dailyRevenue: number, monthlyRevenue: number, annualRevenue: number }> {
        const today = new Date();
        
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));

        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);

        const startOfYear = new Date(today.getFullYear(), 0, 1);
        const endOfYear = new Date(today.getFullYear(), 11, 31, 23, 59, 59, 999);

        const dailyRevenue = await this.paymentRepository.getRevenue(startOfDay, endOfDay);
        const monthlyRevenue = await this.paymentRepository.getRevenue(startOfMonth, endOfMonth);
        const annualRevenue = await this.paymentRepository.getRevenue(startOfYear, endOfYear);

        return { dailyRevenue, monthlyRevenue, annualRevenue };
    }
}
