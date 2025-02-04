import { CityHall } from "../domain/entity/city-hall";
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
}
