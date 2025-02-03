import { PrismaClient } from '@prisma/client';
import { CityHallRepositoryInterface } from '../../domain/interface/repository/city-hall';
import { CityHall } from '../../domain/entity/city-hall';

export class CityHallRepository implements CityHallRepositoryInterface {
    constructor(private prisma: PrismaClient) { }

    public async getAllCityHalls(): Promise<CityHall[]> {
        const cityHalls: CityHall[] = await this.prisma.cityHall.findMany(
            {
                include: {
                    cityHallMedia: true,
                    cityHallPricing: true,
                }
            }
        );

        return cityHalls;
    }

    public async getCityHallById(id: number): Promise<CityHall|null> {
        const cityHall: CityHall|null = await this.prisma.cityHall.findUnique(
            {
                where: {
                    id: id
                },
                include: {
                    cityHallMedia: true,
                    cityHallPricing: true,
                }
            }
        );

        return cityHall;
    }
}