import { Request, Response, NextFunction } from "express";
import { GuesthouseRoom } from "../../domain/entity/guesthouse-room";
import { GuesthouseRoomMedia } from "../../domain/entity/guesthouse-room-media";
import { GuesthouseRoomUsecase } from "../../usecase/guesthouse-room";
import { BaseSuccessResponse } from "../dto/response/base/base-success";
import { GetGuesthouseRoomDataResponse } from "../dto/response/guesthouse-room/get-data";
import { GuesthouseRoomValidation } from "../validation/guesthouse-room";

export class GuesthouseRoomController {
    constructor(private guesthouseRoomUsecase: GuesthouseRoomUsecase) {}

    public async getAllGuesthouseRooms(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id: guesthouseId } = GuesthouseRoomValidation.id.parse({ id: Number(req.params.guesthouse_id) });
            const guesthouseRooms: GuesthouseRoom[] = await this.guesthouseRoomUsecase.getAllGuesthouseRooms(guesthouseId);
            const guesthouseRoomsResponse: GetGuesthouseRoomDataResponse[] = guesthouseRooms.map(guesthouseRoom => GetGuesthouseRoomDataResponse.fromEntity(guesthouseRoom));
            res.status(200).json(new BaseSuccessResponse(true, "Get all guesthouse room success", guesthouseRoomsResponse));
        } catch (error) {
            next(error);
        }
    }

    public async getGuesthouseRoomById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = GuesthouseRoomValidation.id.parse({ id: Number(req.params.room_id)});
            const guesthouseRoom: GuesthouseRoom = await this.guesthouseRoomUsecase.getGuesthouseRoomById(id);
            const guesthouseRoomResponse: GetGuesthouseRoomDataResponse = GetGuesthouseRoomDataResponse.fromEntity(guesthouseRoom);
            res.status(200).json(new BaseSuccessResponse(true, "Get guesthouse room success", guesthouseRoomResponse));
        } catch (error) {
            next(error);
        }
    }
}