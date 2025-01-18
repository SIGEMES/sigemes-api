export interface JwtInterface {
    generateToken(payload: object): string;
    verifyToken(token: string): object | string;
}