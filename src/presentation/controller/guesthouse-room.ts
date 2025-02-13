import { Request, Response, NextFunction } from "express";
import { GuesthouseRoom } from "../../domain/entity/guesthouse-room";
import { GuesthouseRoomMedia } from "../../domain/entity/guesthouse-room-media";
import { GuesthouseRoomUsecase } from "../../usecase/guesthouse-room";
import { BaseSuccessResponse } from "../dto/response/base/base-success";
import { GetGuesthouseRoomDataResponse } from "../dto/response/guesthouse-room/get-data";
import { GuesthouseRoomValidation } from "../validation/guesthouse-room";
import { File } from "../../domain/interface/library/file";
import { CreateGuesthouseRoomRequest } from "../dto/request/guesthouse-room/create";

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

    public async createGuesthouseRoom(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            let guesthouseRoomMedia: File[] = [];
            if (typeof req.body.available_slot === 'string') {
                req.body.available_slot = parseFloat(req.body.available_slot);
            }
            if (typeof req.body.total_slot === 'string') {
                req.body.total_slot = parseFloat(req.body.total_slot);
            }
            if (typeof req.body.area_m2 === 'string') {
                req.body.area_m2 = parseFloat(req.body.area_m2);
            }
            if (typeof req.body.room_pricing === 'string') {
                req.body.room_pricing = JSON.parse(req.body.room_pricing);
            }

            const { id: guesthouseId } = GuesthouseRoomValidation.id.parse({ id: Number(req.params.guesthouse_id) });
            const guesthouseRoom: CreateGuesthouseRoomRequest = GuesthouseRoomValidation.createGuesthouseRoom.parse(req.body);
            const guesthouseRoomEntity: GuesthouseRoom = CreateGuesthouseRoomRequest.toEntity(guesthouseRoom);
            guesthouseRoomEntity.guesthouseId = guesthouseId;

            if (req.files && Array.isArray(req.files)) {
                guesthouseRoomMedia = req.files.map(file => ({
                    fieldname: file.fieldname,
                    originalName: file.originalname,
                    mimeType: file.mimetype,
                    buffer: file.buffer,
                    size: file.size
                }));
            }

            const createdGuesthouseRoom: GuesthouseRoom = await this.guesthouseRoomUsecase.createGuesthouseRoom(guesthouseRoomEntity, guesthouseRoomMedia);
            const guesthouseRoomResponse: GetGuesthouseRoomDataResponse = GetGuesthouseRoomDataResponse.fromEntity(createdGuesthouseRoom);
            res.status(201).json(new BaseSuccessResponse(true, "Create guesthouse room success", guesthouseRoomResponse));
        } catch (error) {
            next(error);
        }
    }
}