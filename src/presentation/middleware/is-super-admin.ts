import { Response, Request, NextFunction } from "express";
import { ResponseError } from "../../domain/error/response-error";

export const isSuperAdminMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (res.locals.user.role !== 'super_admin') {
        throw new ResponseError('Unauthorized', 401);
    }

    next();
}