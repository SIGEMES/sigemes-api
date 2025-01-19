import { Response, Request, NextFunction } from "express";
import { ZodError } from "zod";
import { ResponseError } from "../../domain/error/response-error";
import { BaseFailedResponse } from "../dto/response/base-failed";

export const errorMiddleware = async (error: Error, req: Request, res: Response, next: NextFunction) => {
    if (error instanceof ZodError) {
        const messages = error.issues.map(issue => issue.message).join(', ');
        res.status(400).json(new BaseFailedResponse(
            false,
            messages,
        ));
    } else if (error instanceof ResponseError) {
        res.status(error.statusCode).json(new BaseFailedResponse(
            false,
            error.message,
        ));
    } else {
        res.status(500).json(new BaseFailedResponse(
            false,
            error.message,
        ));
    }
}