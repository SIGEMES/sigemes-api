export class BaseFailedResponse {
    constructor(
        public status: boolean,
        public message: string,
    ) {}
}