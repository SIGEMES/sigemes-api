import { Bucket, Storage } from "@google-cloud/storage";
import { ObjectStorageInterface } from "../../domain/interface/object-storage";
import { File } from "../../domain/interface/file";

export class CloudStorageService implements ObjectStorageInterface{
    private storage: Storage;
    private bucketName: string;
    private bucket: Bucket;

    constructor() {
        this.bucketName = "sigemes-storage";

        const gcpKey: string = process.env.GCP_KEY || '';
        if (!gcpKey) {
            throw new Error('GCP_KEY is required');
        }

        const jsonKey = JSON.parse(gcpKey);

        this.storage = new Storage({
            credentials: jsonKey,
        });

        this.bucket = this.storage.bucket(this.bucketName);
    }

    public async uploadFile(file: File, destinationPath: string): Promise<string> {
        const fileUpload = this.bucket.file(`${destinationPath}/${file.originalName}`);

        const blobStream: NodeJS.WritableStream = fileUpload.createWriteStream({
            resumable: false,
            metadata: {
                contentType: file.mimeType
            }
        });
        
        await new Promise<void>((resolve, reject) => {
            blobStream.on('finish', () => {
                resolve();
            })
            .on('error', (err) => {
                reject(new Error(`Unable to upload image: ${err.message}`));
            })
            .end(file.buffer);
        });

        return `https://storage.googleapis.com/${this.bucketName}/${destinationPath}/${file.originalName}`;
    }

    public async deleteFile(path: string): Promise<void> {
        const file = this.bucket.file(path);
        await file.delete();
    }
}


