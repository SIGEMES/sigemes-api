import { CityHall } from "../domain/entity/city-hall";
import { CityHallMedia } from "../domain/entity/city-hall-media";
import { CityHallPricing } from "../domain/entity/city-hall-pricing";
import { ResponseError } from "../domain/error/response-error";
import { ObjectStorageInterface } from "../domain/interface/external-service/object-storage";
import { File } from "../domain/interface/library/file";
import { CityHallRepositoryInterface } from "../domain/interface/repository/city-hall";

export class CityHallUsecase {
    constructor(
        private cityHallRepository: CityHallRepositoryInterface,
        private objectStorageService: ObjectStorageInterface
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

    public async createCityHall(cityHall: CityHall, cityHallImages: File[]): Promise<CityHall> {
        // hash filename
        cityHallImages = cityHallImages.map(file => ({
            ...file,
            originalName: `${Date.now()}-${Math.random().toString(36).substring(7)}-${file.originalName}`,
        }));

        const cityHallImagesURL: string[] = await this.objectStorageService.uploadMultipleFiles(cityHallImages, "city-hall-media");

        // map cityHallImagesURL to cityHallMedia attribute
        cityHall.cityHallMedia = cityHallImagesURL.map((url, index) => ({
            id: index,
            cityHallId: cityHall.id,
            url,
        }));

        const newCityHall: CityHall = await this.cityHallRepository.createCityHall(cityHall);

        return newCityHall;
    }

    public async updateCityHall(id: number, cityHall: CityHall, cityHallImages: File[], deletedObjectImages: CityHallMedia[]): Promise<CityHall> {
        const oldCityHallData: CityHall|null = await this.cityHallRepository.getCityHallById(id);

        if (!oldCityHallData) {
            throw new ResponseError("City hall not found", 404);
        }

        const updatedCityHall: CityHall = await this.cityHallRepository.updateCityHallOnly(id, cityHall);
        let newCityHallMedia: CityHallMedia[] = [];
        if (cityHallImages.length > 0) {
            // hash filename
            cityHallImages = cityHallImages.map(file => ({
                ...file,
                originalName: `${Date.now()}-${Math.random().toString(36).substring(7)}-${file.originalName}`,
            }));

            const cityHallImagesURL: string[] = await this.objectStorageService.uploadMultipleFiles(cityHallImages, "city-hall-media");

            // map cityHallImagesURL to cityHallMedia attribute
            const cityHallMedia: CityHallMedia[] = cityHallImagesURL.map((url, index) => ({
                id: index,
                cityHallId: id,
                url,
            }));

            newCityHallMedia = await this.cityHallRepository.createCityHallMedia(cityHallMedia);
        }

        let deletedImageId: number[] = [];
        if (deletedObjectImages.length > 0) {
            for (const image of deletedObjectImages) {
                const cityHallImage: CityHallMedia|null = await this.cityHallRepository.getCityHallMediaById(image.id);
                if (!cityHallImage) {
                    throw new ResponseError("City hall image not found", 404);
                }

                if(cityHallImage.url !== image.url) {
                    throw new ResponseError("City hall image not found", 404);
                }

                const imageName: string = image.url.split('/').pop() as string;
                const imagePath: string = `city-hall-media/${imageName}`;
                await this.objectStorageService.deleteFile(imagePath);
                await this.cityHallRepository.deleteCityHallMedia(image.id);
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
                        await this.cityHallRepository.updateCityHallPricing(cityHallPricing);
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
            newCityHallPricingFinal = await this.cityHallRepository.createCityHallPricing(newCityHallPricingData);
        }

        finalCityHallPricing = finalCityHallPricing.concat(newCityHallPricingFinal);

        if (deletedCityHallPricingId.length !== 0) {
            for (const id of deletedCityHallPricingId) {
                await this.cityHallRepository.deleteCityHallPricing(id);
            }
        }

        updatedCityHall.cityHallPricing = finalCityHallPricing;
        updatedCityHall.cityHallMedia = finalCityHallMedia;

        return updatedCityHall;
    }
}
