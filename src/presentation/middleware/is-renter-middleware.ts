import { Response, Request, NextFunction } from "express";
import { ResponseError } from "../../domain/error/response-error";

export const isRenterMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (res.locals.user.role !== 'renter') {
        throw new ResponseError('Unauthorized', 401);
    }

    next();
}