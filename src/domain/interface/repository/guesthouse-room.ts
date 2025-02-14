import { GuesthouseRoom } from "../../entity/guesthouse-room";
import { GuesthouseRoomMedia } from "../../entity/guesthouse-room-media";
import { GuesthouseRoomPricing } from "../../entity/guesthouse-room-pricing";

export interface GuesthouseRoomRepositoryInterface {
    getAllRoomsByGuesthouseId(guesthouseId: number): Promise<GuesthouseRoom[]>;
    getGuesthouseRoomById(id: number): Promise<GuesthouseRoom|null>;
    getGuesthouseRoomMediaById(id: number): Promise<GuesthouseRoomMedia|null>;
    createGuesthouseRoom(room: GuesthouseRoom): Promise<GuesthouseRoom>;
    createGuesthouseRoomMedia(roomMedia: GuesthouseRoomMedia[], transaction?: any): Promise<GuesthouseRoomMedia[]>;
    createGuesthouseRoomPricing(roomPricing: GuesthouseRoomPricing[], transaction?: any): Promise<GuesthouseRoomPricing[]>;
    updateGuesthouseRoomOnly(room: GuesthouseRoom, transaction?: any): Promise<GuesthouseRoom>;
    updateGuesthouseRoomPricing(roomPricing: GuesthouseRoomPricing, transaction?: any): Promise<GuesthouseRoomPricing>;
    deleteGuesthouseRoomById(id: number, transaction?: any): Promise<void>;
    deleteGuesthouseRoomMediaById(id: number, transaction?: any): Promise<void>;
    deleteGuesthouseRoomPricingById(id: number, transaction?: any): Promise<void>;
}