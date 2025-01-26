import { File } from "../library/file";

export interface ObjectStorageInterface {
    uploadFile(file: File, path: string): Promise<string>;
    deleteFile(path: string): Promise<void>;
}