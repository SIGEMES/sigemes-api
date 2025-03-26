import { Pagination } from "../../../../domain/entity/pagination";

export class PaginationResponse {
    constructor(
        public page: number,
        public limit: number,
        public total_data: number,
        public last_page: number,
    ) {}

    public static fromEntity(pagination: Pagination): PaginationResponse {
        return new PaginationResponse(
            pagination.page,
            pagination.limit,
            pagination.totalData,
            pagination.lastPage,
        );
    }
}