import jwt from 'jsonwebtoken';
import { JwtInterface } from '../../domain/interface/jwt';

export class JwtService implements JwtInterface {
    private jwtSecret: string = process.env.JWT_SECRET as string;

    public generateToken(payload: object): string {
        return jwt.sign(payload, this.jwtSecret);
    }

    public verifyToken(token: string): object | string {
        return jwt.verify(token, this.jwtSecret);
    }
}