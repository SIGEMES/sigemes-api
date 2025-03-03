export class RevenueSummaryResponse {
    constructor(
        public daily_revenue: number,
        public monthly_revenue: number,
        public annual_revenue: number
    ) { }
}