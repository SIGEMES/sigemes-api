import crypto from "crypto";
import { CryptoInterface } from "../../domain/interface/library/crypto";
import { validate } from "uuid";

export class CryptoService implements CryptoInterface {
    public generateUUIDv4(): string {
        return crypto.randomUUID();
    }

    public isUUID(uuid: string): boolean {
        return validate(uuid);
    }
}