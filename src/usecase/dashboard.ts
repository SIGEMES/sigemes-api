import { PaymentRepositoryInterface } from "../domain/interface/repository/payment";
import { GuesthouseRepositoryInterface } from "../domain/interface/repository/guesthouse";
import { Guesthouse } from "../domain/entity/guesthouse";
import { CityHallRepositoryInterface } from "../domain/interface/repository/city-hall";
import { CityHall } from "../domain/entity/city-hall";
import { FinancialReportSummary } from "../domain/entity/financial-report-summary";

export class DashboardUsecase {
    constructor(
        private paymentRepository: PaymentRepositoryInterface,
        private guesthouseRepository: GuesthouseRepositoryInterface,
        private cityHallRepository: CityHallRepositoryInterface,
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

    public async getFinancialReportSummary(date: Date): Promise<FinancialReportSummary[]> {
        const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);

        const guesthouses: Guesthouse[] = await this.guesthouseRepository.getAllGuesthousesWithPricing();
        const cityHalls: CityHall[] = await this.cityHallRepository.getAllCityHallsWithPricing();
            
        let guestHousesMap: Map<string, number[]> = new Map();
        let cityHallsMap: Map<string, number[]> = new Map();
        for (const guesthouse of guesthouses) {
            let pricingIds: number[] = [];
            for (const room of guesthouse.guesthouseRoom) {
                pricingIds = pricingIds.concat(room.guesthouseRoomPricing.map(pricing => pricing.id));
            }

            guestHousesMap.set(guesthouse.name, pricingIds);
        }
        for (const cityHall of cityHalls) {
            cityHallsMap.set(cityHall.name, cityHall.cityHallPricing.map(pricing => pricing.id));
        }

        let revenueSummary: FinancialReportSummary[] = [];

        // Calculate revenue from guesthouses
        for (const [guesthouseName, pricingIds] of guestHousesMap) {
            const summary: {
                count: number,
                revenue: number,
            } = await this.paymentRepository.getRevenueAndCountByGuesthousePricingIds(pricingIds, startOfMonth, endOfMonth);
            revenueSummary.push({
                propertyName: guesthouseName,
                transactionCount: summary.count,
                revenueTotal: summary.revenue,
            });
        }

        // Calculate revenue from city halls
        for (const [cityHallName, pricingIds] of cityHallsMap) {
            const summary: {
                count: number,
                revenue: number,
            } = await this.paymentRepository.getRevenueAndCountByCityHallPricingIds(pricingIds, startOfMonth, endOfMonth);
            revenueSummary.push({
                propertyName: cityHallName,
                transactionCount: summary.count,
                revenueTotal: summary.revenue,
            });
        }

        return revenueSummary;
    }
}
