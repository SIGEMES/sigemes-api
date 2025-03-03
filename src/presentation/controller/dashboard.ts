import { Request, Response, NextFunction } from 'express';
import { BaseSuccessResponse } from '../dto/response/base/base-success';
import { DashboardUsecase } from '../../usecase/dashboard';
import { RevenueSummaryResponse } from '../dto/response/dashboard/revenue-summary';

export class DashboardController {
    constructor(private dashboardUsecase: DashboardUsecase) { }

    public async getRevenueSummary(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const revenueSummary: {
                dailyRevenue: number,
                monthlyRevenue: number,
                annualRevenue: number
            } = await this.dashboardUsecase.getRevenueSummary();

            const revenueSummaryResponse = new RevenueSummaryResponse(
                revenueSummary.dailyRevenue,
                revenueSummary.monthlyRevenue,
                revenueSummary.annualRevenue
            );

            res.status(200).json(new BaseSuccessResponse(true, "Get revenue summary success", revenueSummaryResponse));
        } catch (error) {
            next(error);
        }
    }
}
