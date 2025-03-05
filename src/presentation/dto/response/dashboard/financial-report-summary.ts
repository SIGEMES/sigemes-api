import { FinancialReportSummary } from "../../../../domain/entity/financial-report-summary";

export class FinancialReportSummaryResponse {
    constructor(
        public property_name: string = '',
        public transaction_count: number = 0,
        public revenue_total: number = 0,
    ) {}

    public static fromEntity(entity: FinancialReportSummary): FinancialReportSummaryResponse {
        return new FinancialReportSummaryResponse(
            entity.propertyName,
            entity.transactionCount,
            entity.revenueTotal
        );
    }
}