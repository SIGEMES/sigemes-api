export interface CryptoInterface {
    generateUUIDv4(): string;
    isUUID(uuid: string): boolean;
}