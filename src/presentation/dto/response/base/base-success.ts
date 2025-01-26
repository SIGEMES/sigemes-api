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