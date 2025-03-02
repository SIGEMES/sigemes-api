import crypto from "crypto";
import { CryptoInterface } from "../../domain/interface/library/crypto";

export class CryptoService implements CryptoInterface {
    public generateUUIDv4(): string {
        return crypto.randomUUID();
    }
}