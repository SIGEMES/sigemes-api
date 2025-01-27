export class Admin {
    constructor(
        public id: number = 0,
        public email: string = '',
        public password: string = '',
        public fullname: string = '',
        public phoneNumber: string = '',
        public profilePicture: string = '',
        public isSuperAdmin: boolean = false,
        public createdAt: Date = new Date(),
        public updatedAt: Date = new Date(),
    ) {}
}