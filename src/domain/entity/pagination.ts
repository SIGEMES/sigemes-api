export class Pagination {
    constructor(
        public page: number = 0,
        public limit: number = 0,
        public totalData: number = 0,
        public lastPage: number = 0,
    ) {}
}