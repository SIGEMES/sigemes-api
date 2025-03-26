export class BaseSuccessResponse {
    constructor(
        public status: boolean,
        public message: string,
        public data?: any,
    ) {
        if (this.data === null) {
            this.data = undefined
        }
    }
}

export class BaseSuccessPaginatedResponse {
    constructor(
        public status: boolean,
        public message: string,
        public pagination: any,
        public data: any,
    ) {}
}