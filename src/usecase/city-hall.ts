import { start } from "repl";
import { CityHall } from "../domain/entity/city-hall";
import { CityHallMedia } from "../domain/entity/city-hall-media";
import { CityHallPricing } from "../domain/entity/city-hall-pricing";
import { Rent } from "../domain/entity/rent";
import { ResponseError } from "../domain/error/response-error";
import { ObjectStorageInterface } from "../domain/interface/external-service/object-storage";
import { File } from "../domain/interface/library/file";
import { CityHallRepositoryInterface } from "../domain/interface/repository/city-hall";
import { DbTransactionInterface } from "../domain/interface/repository/db-transaction";
import { RentRepositoryInterface } from "../domain/interface/repository/rent";

export class CityHallUsecase {
    constructor(
        private cityHallRepository: CityHallRepositoryInterface,
        private rentRepository: RentRepositoryInterface,
        private objectStorageService: ObjectStorageInterface,
        private dbTransaction: DbTransactionInterface,
    ) {}

    public async getAllCityHalls(userRole: string, startDate: Date|null, endDate: Date|null): Promise<CityHall[]> {
        let cityHalls: CityHall[] = await this.cityHallRepository.getAllCityHalls();

        if (userRole === "renter" && (!startDate || !endDate)) {
            throw new ResponseError("Required query parameter: start_date and end_date for renter", 400);
        }

        if (startDate && endDate) {
            if (startDate > endDate) {
                throw new ResponseError("Start date must be before or equal to end date", 400);
            }

            const cityHallPricingIds: number[] = cityHalls.flatMap(cityHall =>
                cityHall.cityHallPricing.map(cityHallPricing => cityHallPricing.id)
            )

            const rentedCityHalls: Rent[] = await this.rentRepository.getFilteredActiveRentsByCityHallPricingIds(
                cityHallPricingIds,
                startDate,
                endDate,
            );

            const rentMap: Map<number, Rent> = new Map();
            for (const rentedCityHall of rentedCityHalls) {
                if (rentedCityHall.cityHallPricingId) {
                    rentMap.set(rentedCityHall.cityHallPricingId, rentedCityHall);
                }
            }

            for (const cityHall of cityHalls) {
                for (const pricing of cityHall.cityHallPricing) {
                    const rentedCityHall: Rent|undefined = rentMap.get(pricing.id);
                    if (rentedCityHall) {
                        cityHall.status = "tidak_tersedia";
                        break;
                    }
                }
            }
        }

        return cityHalls;
    }

    public async getCityHallById(id: number, userRole: string, startDate: Date|null, endDate: Date|null): Promise<CityHall> {
        const cityHall: CityHall|null = await this.cityHallRepository.getCityHallById(id);

        if (!cityHall) {
            throw new ResponseError("City hall not found", 404);
        }

        if (userRole === "renter" && (!startDate || !endDate)) {
            throw new ResponseError("Required query parameter: start_date and end_date for renter", 400);
        }

        if (startDate && endDate) {
            if (startDate > endDate) {
                throw new ResponseError("Start date must be before or equal to end date", 400);
            }

            const rentedCityHalls: Rent[] = await this.rentRepository.getFilteredActiveRentsByCityHallPricingIds(
                cityHall.cityHallPricing.map(pricing => pricing.id),
                startDate,
                endDate,
            );

            if (rentedCityHalls.length > 0) {
                cityHall.status = "tidak_tersedia";
            }
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

    public async updateCityHall(id: number, cityHall: CityHall, cityHallMediaReq: File[], deletedObjectMedia: CityHallMedia[]): Promise<CityHall> {
        // Using transaction to ensure data consistency
        return await this.dbTransaction.run(async (tx) => {
            const oldCityHallData: CityHall|null = await this.cityHallRepository.getCityHallById(id);
    
            if (!oldCityHallData) {
                throw new ResponseError("City hall not found", 404);
            }
            
            const updatedCityHall: CityHall = await this.cityHallRepository.updateCityHallOnly(id, cityHall, tx);
    
            const oldCityHallPricingCount: number = oldCityHallData.cityHallPricing.length;
            let notNewCityHallPricingCount: number = 0
            let newCityHallPricingData: CityHallPricing[] = [];
            let notDeletedCityHallPricingId: number[] = [];
            let finalCityHallPricing: CityHallPricing[] = [];
            for (const cityHallPricing of cityHall.cityHallPricing) {
                if (cityHallPricing.id === 0) {
                    cityHallPricing.cityHallId = id;
                    newCityHallPricingData.push(cityHallPricing);
                } else {
                    let i: number = notNewCityHallPricingCount;
                    while (i < oldCityHallPricingCount) {
                        let isUpdated: boolean = false;
                        notNewCityHallPricingCount++;
                        if (cityHallPricing.id === oldCityHallData.cityHallPricing[i].id) {
                            if (cityHallPricing.activityType !== oldCityHallData.cityHallPricing[i].activityType) {
                                isUpdated = true;
                            }
                            if (cityHallPricing.facilities !== oldCityHallData.cityHallPricing[i].facilities) {
                                isUpdated = true;
                            }
                            if (cityHallPricing.pricePerDay !== oldCityHallData.cityHallPricing[i].pricePerDay) {
                                isUpdated = true;
                            }
                            if (cityHallPricing.isActive !== oldCityHallData.cityHallPricing[i].isActive) {
                                isUpdated = true;
                            }

                            if (isUpdated) {
                                await this.cityHallRepository.updateCityHallPricing(cityHallPricing, tx);
                            }
                            finalCityHallPricing.push(cityHallPricing);
                            notDeletedCityHallPricingId.push(cityHallPricing.id);
                            break;
                        }
                        i++;
                    }
                }
            }
    
            let newCityHallPricingFinal: CityHallPricing[] = [];
            if (newCityHallPricingData.length > 0) {
                newCityHallPricingFinal = await this.cityHallRepository.createCityHallPricing(newCityHallPricingData, tx);
            }
    
            finalCityHallPricing = finalCityHallPricing.concat(newCityHallPricingFinal);
    
            for (const pricing of oldCityHallData.cityHallPricing) {
                if (!notDeletedCityHallPricingId.includes(pricing.id)) {
                    await this.cityHallRepository.deleteCityHallPricing(pricing.id, tx);
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
    
            let deletedMediaId: number[] = [];
            if (deletedObjectMedia.length > 0) {
                for (const media of deletedObjectMedia) {
                    const cityHallMedia: CityHallMedia|null = await this.cityHallRepository.getCityHallMediaById(media.id, tx);
                    if (!cityHallMedia) {
                        throw new ResponseError("City hall media not found", 404);
                    }
    
                    if(cityHallMedia.url !== media.url) {
                        throw new ResponseError("City hall media not found", 404);
                    }
    
                    const mediaName: string = media.url.split('/').pop() as string;
                    const mediaPath: string = `city-hall-media/${mediaName}`;
                    await this.objectStorageService.deleteFile(mediaPath);
                    await this.cityHallRepository.deleteCityHallMedia(media.id, tx);
                    deletedMediaId.push(media.id);
                }
            }
    
            let finalCityHallMedia: CityHallMedia[] = [];
            for (const media of oldCityHallData.cityHallMedia) {
                if (!deletedMediaId.includes(media.id)) {
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
                const mediaName: string = media.url.split('/').pop() as string;
                const mediaPath: string = `city-hall-media/${mediaName}`;
                await this.objectStorageService.deleteFile(mediaPath);
            }
        }

        return deletedCityHall;
    }
}
