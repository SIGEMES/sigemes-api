import { GuesthouseRoom } from "../../entity/guesthouse-room";
import { GuesthouseRoomMedia } from "../../entity/guesthouse-room-media";
import { GuesthouseRoomPricing } from "../../entity/guesthouse-room-pricing";

export interface GuesthouseRoomRepositoryInterface {
    getAllRoomsByGuesthouseId(guesthouseId: number): Promise<GuesthouseRoom[]>;
    getGuesthouseRoomById(id: number): Promise<GuesthouseRoom|null>;
    createGuesthouseRoom(room: GuesthouseRoom): Promise<GuesthouseRoom>;
}