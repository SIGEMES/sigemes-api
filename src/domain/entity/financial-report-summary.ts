export class FinancialReportSummary {
    constructor(
        public propertyName: string = '',
        public transactionCount: number = 0,
        public revenueTotal: number = 0,
    ) {}
}