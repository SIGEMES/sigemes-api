import { Request, Response, NextFunction } from 'express';
import { CityHall } from '../../domain/entity/city-hall';
import { CityHallUsecase } from '../../usecase/city-hall';
import { BaseSuccessResponse } from '../dto/response/base/base-success';
import { GetCityHallDataResponse } from '../dto/response/city-hall/get-data';
import { CityHallValidation } from '../validation/city-hall';
import { CreateCityHallRequest } from '../dto/request/city-hall/create';
import { File } from '../../domain/interface/library/file';
import { json } from 'stream/consumers';
import { UpdateCityHallRequest } from '../dto/request/city-hall/update';
import { CityHallMediaRequest } from '../dto/request/city-hall/media';
import { CityHallMedia } from '../../domain/entity/city-hall-media';

export class CityHallController {
    constructor(private cityHallUsecase: CityHallUsecase) {}

    public async getAllCityHalls(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const cityHalls: CityHall[] = await this.cityHallUsecase.getAllCityHalls();
            const cityHallsResponse: GetCityHallDataResponse[] = cityHalls.map(cityHall => GetCityHallDataResponse.fromEntity(cityHall));
            res.status(200).json(new BaseSuccessResponse(true, "Get all city hall success", cityHallsResponse));
        } catch (error) {
            next(error);
        }
    }

    public async getCityHallById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id } = CityHallValidation.id.parse({ id: Number(req.params.id)});
            const cityHall: CityHall = await this.cityHallUsecase.getCityHallById(id);
            const cityHallResponse: GetCityHallDataResponse = GetCityHallDataResponse.fromEntity(cityHall);
            res.status(200).json(new BaseSuccessResponse(true, "Get city hall success", cityHallResponse));
        } catch (error) {
            next(error);
        }
    }

    public async createCityHall(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            let cityHallImages: File[] = [];
            if (typeof req.body.area_m2 === 'string') {
                req.body.area_m2 = parseFloat(req.body.area_m2);
            }
            if (typeof req.body.people_capacity === 'string') {
                req.body.people_capacity = parseFloat(req.body.people_capacity);
            }
            if (typeof req.body.latitude === 'string') {
                req.body.latitude = parseFloat(req.body.latitude);
            }
            if (typeof req.body.longitude === 'string') {
                req.body.longitude = parseFloat(req.body.longitude);
            }
            if (typeof req.body.pricing === 'string') {
                req.body.pricing = JSON.parse(req.body.pricing);
            }

            const cityHall: CreateCityHallRequest = CityHallValidation.createCityHall.parse(req.body);

            if (req.files && Array.isArray(req.files)) {
                cityHallImages = req.files.map(file => ({
                    fieldname: file.fieldname,
                    originalName: file.originalname,
                    mimeType: file.mimetype,
                    buffer: file.buffer,
                    size: file.size
                }));
            }

            const newCityHall: CityHall = await this.cityHallUsecase.createCityHall(CreateCityHallRequest.toEntity(cityHall), cityHallImages);
            const cityHallResponse: GetCityHallDataResponse = GetCityHallDataResponse.fromEntity(newCityHall);
            res.status(201).json(new BaseSuccessResponse(true, "Create city hall success", cityHallResponse));
        } catch (error) {
            next(error);
        }
    }

    public async updateCityHall(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            let cityHallImages: File[] = [];
            let deletedImages: CityHallMediaRequest[] = [];
            if (typeof req.body.area_m2 === 'string') {
                req.body.area_m2 = parseFloat(req.body.area_m2);
            }
            if (typeof req.body.people_capacity === 'string') {
                req.body.people_capacity = parseFloat(req.body.people_capacity);
            }
            if (typeof req.body.latitude === 'string') {
                req.body.latitude = parseFloat(req.body.latitude);
            }
            if (typeof req.body.longitude === 'string') {
                req.body.longitude = parseFloat(req.body.longitude);
            }
            if (typeof req.body.pricing === 'string') {
                req.body.pricing = JSON.parse(req.body.pricing);
            }
            if (typeof req.body.deleted_images_object_data === 'string') {
                req.body.deleted_images_object_data = JSON.parse(req.body.deleted_images_object_data);
            }

            const { id } = CityHallValidation.id.parse({ id: Number(req.params.id)});
            const cityHall: UpdateCityHallRequest = CityHallValidation.updateCityHall.parse(req.body);

            if (req.files && Array.isArray(req.files)) {
                cityHallImages = req.files.map(file => ({
                    fieldname: file.fieldname,
                    originalName: file.originalname,
                    mimeType: file.mimetype,
                    buffer: file.buffer,
                    size: file.size
                }));
            }

            if (req.body.deleted_images_object_data) {
                deletedImages = CityHallValidation.deletedImages.parse(req.body.deleted_images_object_data);
            }

            const createCityHallEntity: CityHall = CreateCityHallRequest.toEntity(cityHall);
            
            const deletedImagesEntity: CityHallMedia[] = deletedImages.map((image) => ({
                id: image.id,
                cityHallId: 0,
                url: image.url,
            }));

            const updatedCityHall: CityHall = await this.cityHallUsecase.updateCityHall(id, createCityHallEntity, cityHallImages, deletedImagesEntity);
            const cityHallResponse: GetCityHallDataResponse = GetCityHallDataResponse.fromEntity(updatedCityHall);
            res.status(200).json(new BaseSuccessResponse(true, "Update city hall success", cityHallResponse));
        } catch (error) {
            next(error);
        }
    }
}
