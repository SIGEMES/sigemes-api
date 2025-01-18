import jwt from 'jsonwebtoken'
import { Response, Request, NextFunction } from 'express'
import { ResponseError } from '../../domain/error/response-error'

export const jwtMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader: string | undefined = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new ResponseError('Token not provided', 401);
    }

    const token: string = authHeader.split(' ')[1];
    let decoded: jwt.JwtPayload | string;

    try {
        if (!process.env.JWT_SECRET) {
            throw new ResponseError('JWT secret not defined', 500);
        }
        decoded = jwt.verify(token, process.env.JWT_SECRET);
        res.locals.user = decoded;
    } catch (err) {
        throw new ResponseError('Invalid token', 401);
    }

    next();
}
