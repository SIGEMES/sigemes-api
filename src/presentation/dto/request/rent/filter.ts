import { 
    RentFilter,
    RentStatus,
    RentType,
    CheckinCheckoutStatus,
} from "../../../../domain/entity/rent";

export class RentFilterRequest {
    constructor (
        public page?: number,
        public limit?: number,
        public search?: string,
        public type?: RentType,
        public status?: RentStatus,
        public checkin_checkout_status?: CheckinCheckoutStatus,
        public start_date?: Date,
        public end_date?: Date,
    ) {}

    public static toEntity(data: RentFilterRequest): RentFilter {
        return new RentFilter(
            data.page ? data.page : 1,
            data.limit ? data.limit : 5,
            data.search ? data.search : null,
            data.type ? data.type : null,
            data.status ? data.status : null,
            data.checkin_checkout_status ? data.checkin_checkout_status : null,
            data.start_date ? data.start_date : null,
            data.end_date ? data.end_date : null,
        );
    }
}

