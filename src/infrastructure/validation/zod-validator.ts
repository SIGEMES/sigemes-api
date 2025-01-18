import { ZodSchema } from "zod";
import { ValidatorInterface } from "../../domain/interface/validator";

export class ZodValidator implements ValidatorInterface {
    private schemas: Record<string, ZodSchema<any>>;

    constructor(schemas: Record<string, ZodSchema<any>>) {
        this.schemas = schemas;
    }

    validate<T>(data: T, schemaKey: string): T {
        const schema = this.schemas[schemaKey];
        return schema.parse(data);
    }
}