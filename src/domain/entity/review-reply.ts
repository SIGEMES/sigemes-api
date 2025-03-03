export class ReviewReply {
    constructor(
        public id: number = 0,
        public reviewId: number = 0,
        public adminId: number = 0,
        public content: string = '',
        public createdAt: Date = new Date(),
        public updatedAt: Date = new Date(),
    ) {}
}