import bcrypt from 'bcrypt';
import { BcryptInterface } from '../../domain/interface/bcrypt';

export class BcryptService implements BcryptInterface {
    async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, 10);
    }

    public async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(password, hashedPassword);
    }
}