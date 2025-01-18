export interface ValidatorInterface {
    validate<T>(data: T, schemaKey: string): T;
}