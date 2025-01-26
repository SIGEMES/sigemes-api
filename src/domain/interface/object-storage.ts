import { File } from "./file";

export interface ObjectStorageInterface {
    uploadFile(file: File, path: string): Promise<string>;
    deleteFile(path: string): Promise<void>;
}