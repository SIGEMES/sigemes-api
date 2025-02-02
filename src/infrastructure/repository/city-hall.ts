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
}