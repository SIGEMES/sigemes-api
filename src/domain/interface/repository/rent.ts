import { Rent, RentFilter, RentStatus } from "../../entity/rent";

export interface RentRepositoryInterface {
    getCountRents(whereConditions: any): Promise<number>;
    getAllRents(page: number, limit: number, whereConditions: any): Promise<Rent[]>;
    getAllRentsByRenterId(renterId: number): Promise<Rent[]>;
    getRentById(rentId: number): Promise<Rent>;
    getRentByIdWithReview(rentId: number): Promise<Rent>;
    getFilteredActiveRentsByGuesthouseRoomPricingIds(guesthouseRoomPricingIds: number[], startDate: Date, endDate: Date): Promise<Rent[]>;
    getFilteredActiveRentsByCityHallPricingIds(cityHallPricingIds: number[], startDate: Date, endDate: Date): Promise<Rent[]>;
    createRent(rent: Rent, transaction?: any): Promise<Rent>;
    updateRentStatus(rentId: number, rentStatus: RentStatus, transaction?: any): Promise<void>;
    updateRentCheckIn(rentId: number, transaction?: any): Promise<void>;
    updateRentCheckOut(rentId: number, transaction?: any): Promise<void>;
}