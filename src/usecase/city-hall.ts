import { CityHall } from "../domain/entity/city-hall";
import { CityHallMedia } from "../domain/entity/city-hall-media";
import { CityHallPricing } from "../domain/entity/city-hall-pricing";
import { ResponseError } from "../domain/error/response-error";
import { ObjectStorageInterface } from "../domain/interface/external-service/object-storage";
import { File } from "../domain/interface/library/file";
import { CityHallRepositoryInterface } from "../domain/interface/repository/city-hall";
import { DbTransactionInterface } from "../domain/interface/repository/db-transaction";

export class CityHallUsecase {
    constructor(
        private cityHallRepository: CityHallRepositoryInterface,
        private objectStorageService: ObjectStorageInterface,
        private dbTransaction: DbTransactionInterface,
    ) {}

    public async getAllCityHalls(): Promise<CityHall[]> {
        const cityHalls: CityHall[] = await this.cityHallRepository.getAllCityHalls();

        return cityHalls;
    }

    public async getCityHallById(id: number): Promise<CityHall> {
        const cityHall: CityHall|null = await this.cityHallRepository.getCityHallById(id);

        if (!cityHall) {
            throw new ResponseError("City hall not found", 404);
        }

        return cityHall;
    }

    public async createCityHall(cityHall: CityHall, cityHallMedia: File[]): Promise<CityHall> {
        // hash filename
        cityHallMedia = cityHallMedia.map(file => ({
            ...file,
            originalName: `${Date.now()}-${Math.random().toString(36).substring(7)}-${file.originalName}`,
        }));

        const cityHallMediaURL: string[] = await this.objectStorageService.uploadMultipleFiles(cityHallMedia, "city-hall-media");

        // map cityHallMediaURL to cityHallMedia attribute
        cityHall.cityHallMedia = cityHallMediaURL.map((url, index) => ({
            id: index,
            cityHallId: cityHall.id,
            url,
        }));

        const newCityHall: CityHall = await this.cityHallRepository.createCityHall(cityHall);

        return newCityHall;
    }

    public async updateCityHall(id: number, cityHall: CityHall, cityHallMediaReq: File[], deletedObjectImages: CityHallMedia[]): Promise<CityHall> {
        // Using transaction to ensure data consistency
        return await this.dbTransaction.run(async (tx) => {
            const oldCityHallData: CityHall|null = await this.cityHallRepository.getCityHallById(id);
    
            if (!oldCityHallData) {
                throw new ResponseError("City hall not found", 404);
            }
            
            const updatedCityHall: CityHall = await this.cityHallRepository.updateCityHallOnly(id, cityHall, tx);
    
            const oldCityHallPricingCount: number = oldCityHallData.cityHallPricing.length;
            let updatedCityHallPricingCount: number = 0
            let newCityHallPricingData: CityHallPricing[] = [];
            let deletedCityHallPricingId: number[] = [];
            let finalCityHallPricing: CityHallPricing[] = [];
            for (const cityHallPricing of cityHall.cityHallPricing) {
                let i: number = updatedCityHallPricingCount;
                let found: boolean = false;
                if (cityHallPricing.id === 0) {
                    newCityHallPricingData.push(cityHallPricing);
                } else {
                    while (i < oldCityHallPricingCount) {
                        if (cityHallPricing.id === oldCityHallData.cityHallPricing[i].id) {
                            await this.cityHallRepository.updateCityHallPricing(cityHallPricing, tx);
                            finalCityHallPricing.push(cityHallPricing);
                            updatedCityHallPricingCount++;
                            found = true;
                            break;
                        }
                        i++;
                    }
    
                    if (!found) {
                        deletedCityHallPricingId.push(cityHallPricing.id);
                    }
                }
            }
    
            let newCityHallPricingFinal: CityHallPricing[] = [];
            if (updatedCityHallPricingCount !== 0) {
                newCityHallPricingFinal = await this.cityHallRepository.createCityHallPricing(newCityHallPricingData, tx);
            }
    
            finalCityHallPricing = finalCityHallPricing.concat(newCityHallPricingFinal);
    
            if (deletedCityHallPricingId.length !== 0) {
                for (const id of deletedCityHallPricingId) {
                    await this.cityHallRepository.deleteCityHallPricing(id, tx);
                }
            }

            let newCityHallMedia: CityHallMedia[] = [];
            if (cityHallMediaReq.length > 0) {
                // hash filename
                cityHallMediaReq = cityHallMediaReq.map(file => ({
                    ...file,
                    originalName: `${Date.now()}-${Math.random().toString(36).substring(7)}-${file.originalName}`,
                }));
    
                const cityHallMediaReqURL: string[] = await this.objectStorageService.uploadMultipleFiles(cityHallMediaReq, "city-hall-media");
    
                // map cityHallMediaReqURL to cityHallMedia attribute
                const cityHallMedia: CityHallMedia[] = cityHallMediaReqURL.map((url, index) => ({
                    id: index,
                    cityHallId: id,
                    url,
                }));
    
                newCityHallMedia = await this.cityHallRepository.createCityHallMedia(cityHallMedia, tx);
            }
    
            let deletedImageId: number[] = [];
            if (deletedObjectImages.length > 0) {
                for (const image of deletedObjectImages) {
                    const cityHallImage: CityHallMedia|null = await this.cityHallRepository.getCityHallMediaById(image.id, tx);
                    if (!cityHallImage) {
                        throw new ResponseError("City hall image not found", 404);
                    }
    
                    if(cityHallImage.url !== image.url) {
                        throw new ResponseError("City hall image not found", 404);
                    }
    
                    const imageName: string = image.url.split('/').pop() as string;
                    const imagePath: string = `city-hall-media/${imageName}`;
                    await this.objectStorageService.deleteFile(imagePath);
                    await this.cityHallRepository.deleteCityHallMedia(image.id, tx);
                    deletedImageId.push(image.id);
                }
            }
    
            let finalCityHallMedia: CityHallMedia[] = [];
            for (const media of oldCityHallData.cityHallMedia) {
                if (!deletedImageId.includes(media.id)) {
                    finalCityHallMedia.push(media);
                }
            }
            finalCityHallMedia = finalCityHallMedia.concat(newCityHallMedia);

            // Assign finalCityHallPricing and finalCityHallMedia to updatedCityHall to return the complete updated data
            updatedCityHall.cityHallPricing = finalCityHallPricing;
            updatedCityHall.cityHallMedia = finalCityHallMedia;
    
            return updatedCityHall;
        });
    }

    public async deleteCityHall(id: number): Promise<CityHall> {
        const cityHall: CityHall|null = await this.cityHallRepository.getCityHallById(id);

        if (!cityHall) {
            throw new ResponseError("City hall not found", 404);
        }

        const deletedCityHall: CityHall = await this.cityHallRepository.deleteCityHall(id);
        
        if(cityHall.cityHallMedia.length > 0) {
            for (const media of cityHall.cityHallMedia) {
                const imageName: string = media.url.split('/').pop() as string;
                const imagePath: string = `city-hall-media/${imageName}`;
                await this.objectStorageService.deleteFile(imagePath);
            }
        }

        return deletedCityHall;
    }
}
