import { Request, Response, NextFunction } from 'express';
import { BaseSuccessResponse } from '../dto/response/base/base-success';
import { DashboardUsecase } from '../../usecase/dashboard';
import { DashboardValidation } from '../validation/dashboard';
import { FinancialReportSummary } from '../../domain/entity/financial-report-summary';
import { FinancialReportSummaryResponse } from '../dto/response/dashboard/financial-report-summary';


export class DashboardController {
    constructor(private dashboardUsecase: DashboardUsecase) { }

    public async getDailyRevenue(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { date: stringDate } = DashboardValidation.date.parse({ date: req.query.date });
            const date = new Date(stringDate);
            const dailyRevenue = await this.dashboardUsecase.getDailyRevenue(date);
            res.status(200).json(new BaseSuccessResponse(true, "Get daily revenue success", dailyRevenue));
        } catch (error) {
            next(error);
        }
    }

    public async getMonthlyRevenue(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { date: stringDate } = DashboardValidation.date.parse({ date: req.query.date });
            const date = new Date(stringDate);
            const monthlyRevenue = await this.dashboardUsecase.getMonthlyRevenue(date);
            res.status(200).json(new BaseSuccessResponse(true, "Get monthly revenue success", monthlyRevenue));
        } catch (error) {
            next(error);
        }
    }

    public async getAnnualRevenue(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { date: stringDate } = DashboardValidation.date.parse({ date: req.query.date });
            const date = new Date(stringDate);
            const annualRevenue = await this.dashboardUsecase.getAnnualRevenue(date);
            res.status(200).json(new BaseSuccessResponse(true, "Get annual revenue success", annualRevenue));
        } catch (error) {
            next(error);
        }
    }

    public async getFinancialReportSummary(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { date: stringDate } = DashboardValidation.date.parse({ date: req.query.date });
            const date = new Date(stringDate);
            const financialReportSummary: FinancialReportSummary[] = await this.dashboardUsecase.getFinancialReportSummary(date);
            const response: FinancialReportSummaryResponse[] = financialReportSummary.map(summary => FinancialReportSummaryResponse.fromEntity(summary));
            res.status(200).json(new BaseSuccessResponse(true, "Get financial report summary success", response));
        } catch (error) {
            next(error);
        }
    }
}
