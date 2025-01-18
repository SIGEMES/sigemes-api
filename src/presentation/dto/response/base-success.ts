export class BaseSuccessResponse {
    constructor(
        public status: boolean,
        public message: string,
        public data?: any,
    ) {}
}