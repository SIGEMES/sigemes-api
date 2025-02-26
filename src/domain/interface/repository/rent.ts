import { Rent } from "../../entity/rent";

export interface RentRepositoryInterface {
    getAllRents(): Promise<Rent[]>;
    getAllRentsByRenterId(renterId: number): Promise<Rent[]>;
    getRentById(rentId: number): Promise<Rent>;
    getActiveRentsByGuesthouseRoomPricingIds(guesthouseRoomPricingIds: number[]): Promise<Rent[]>;
    getFilteredActiveRentsByGuesthouseRoomPricingIds(guesthouseRoomPricingIds: number[], startDate: Date, endDate: Date): Promise<Rent[]>;
    getActiveRentsByCityHallPricingIds(cityHallPricingIds: number[]): Promise<Rent[]>;
    getFilteredActiveRentsByCityHallPricingIds(cityHallPricingIds: number[], startDate: Date, endDate: Date): Promise<Rent[]>;
    createRent(rent: Rent, transaction?: any): Promise<Rent>;
    updateRentStatus(rentId: number, rentStatus: string, transaction?: any): Promise<Rent>;
    updateRentCheckIn(rentId: number, transaction?: any): Promise<Rent>;
    updateRentCheckOut(rentId: number, transaction?: any): Promise<Rent>;
}