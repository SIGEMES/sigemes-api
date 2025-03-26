import { Request, Response, NextFunction } from 'express';
import { Rent } from '../../domain/entity/rent';
import { RentUsecase } from '../../usecase/rent';
import { BaseSuccessPaginatedResponse, BaseSuccessResponse } from '../dto/response/base/base-success';
import { GetRentResponse } from '../dto/response/rent/get-rent';
import { RentValidation } from '../validation/rent';
import { CreateRentRequest } from '../dto/request/rent/create';
import { RentFilter } from '../../domain/entity/rent';
import { RentFilterRequest } from '../dto/request/rent/filter';
import { Pagination } from '../../domain/entity/pagination';
import { PaginationResponse } from '../dto/response/pagination/pagination';

export class RentController {
    constructor(private rentUsecase: RentUsecase) { }

    public async getAllRents(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const filter: RentFilterRequest = RentValidation.filter.parse({
                page: Number(req.query.page),
                limit: Number(req.query.limit),
                search: req.query.search,
                type: req.query.type,
                status: req.query.status,
                checkin_checkout_status: req.query.checkin_checkout_status,
                start_date: req.query.start_date ? new Date(req.query.start_date as string) : undefined,
                end_date: req.query.end_date ? new Date(req.query.end_date as string) : undefined
            });

            const filterEntity: RentFilter = RentFilterRequest.toEntity(filter);

            const result: {
                pagination: Pagination,
                rents: Rent[]
            } = await this.rentUsecase.getAllRents(res.locals.user.id, res.locals.user.role, filterEntity);

            const rentsResponse: GetRentResponse[] = result.rents.map(rent => GetRentResponse.fromEntity(rent));
            const paginationResponse: PaginationResponse = PaginationResponse.fromEntity(result.pagination);
            
            res.status(200).json(new BaseSuccessPaginatedResponse(true, "Get all rents success", paginationResponse , rentsResponse));
        } catch (error) {
            next(error);
        }
    }

    public async getRentById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id: rentId } = RentValidation.id.parse({ id: Number(req.params.id) });
            const rent: Rent = await this.rentUsecase.getRentById(rentId, res.locals.user.id, res.locals.user.role);
            const rentResponse: GetRentResponse = GetRentResponse.fromEntity(rent);
            res.status(200).json(new BaseSuccessResponse(true, "Get rent success", rentResponse));
        } catch (error) {
            next(error);
        }
    }

    public async createRent(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const startDate = new Date(req.body.start_date);
            const endDate = new Date(req.body.end_date);
            req.body.start_date = startDate;
            req.body.end_date = endDate
            const validatedData: CreateRentRequest = RentValidation.create.parse(req.body);
            const rentEntity = CreateRentRequest.toEntity(validatedData);
            rentEntity.renterId = res.locals.user.id;
            const rent: Rent = await this.rentUsecase.createRent(rentEntity);
            const rentResponse: GetRentResponse = GetRentResponse.fromEntity(rent);
            res.status(201).json(new BaseSuccessResponse(true, "Create rent plan success", rentResponse));
        } catch (error) {
            next(error);
        }
    }

    public async cancelRent(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id: rentId } = RentValidation.id.parse({ id: Number(req.params.id) });
            const rent: Rent = await this.rentUsecase.cancelRent(rentId, res.locals.user.id, res.locals.user.role);
            const rentResponse: GetRentResponse = GetRentResponse.fromEntity(rent);
            res.status(200).json(new BaseSuccessResponse(true, "Cancel rent success", rentResponse));
        } catch (error) {
            next(error);
        }
    }

    public async checkInRent(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id: rentId } = RentValidation.id.parse({ id: Number(req.params.id) });
            const rent: Rent = await this.rentUsecase.checkInRent(rentId);
            const rentResponse: GetRentResponse = GetRentResponse.fromEntity(rent);
            res.status(200).json(new BaseSuccessResponse(true, "Check in rent success", rentResponse));
        } catch (error) {
            next(error);
        }
    }

    public async checkOutRent(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { id: rentId } = RentValidation.id.parse({ id: Number(req.params.id) });
            const rent: Rent = await this.rentUsecase.checkOutRent(rentId);
            const rentResponse: GetRentResponse = GetRentResponse.fromEntity(rent);
            res.status(200).json(new BaseSuccessResponse(true, "Check out rent success", rentResponse));
        } catch (error) {
            next(error);
        }
    }
}

