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

    public async createCityHall(cityHall: CityHall): Promise<CityHall> {
        const createdCityHall: CityHall = await this.prisma.cityHall.create(
            {
                data: {
                    name: cityHall.name,
                    description: cityHall.description,
                    areaM2: cityHall.areaM2,
                    peopleCapacity: cityHall.peopleCapacity,
                    address: cityHall.address,
                    latitude: cityHall.latitude,
                    longitude: cityHall.longitude,
                    contactPerson: cityHall.contactPerson,
                    cityHallMedia: {
                        create: cityHall.cityHallMedia.map(media => ({
                            url: media.url,
                        }))
                    },
                    cityHallPricing: {
                        create: cityHall.cityHallPricing.map(pricing => ({
                            activityType: pricing.activityType,
                            facilities: pricing.facilities,
                            pricePerDay: pricing.pricePerDay,
                        }))
                    },
                },
                select: {
                    id: true,
                    name: true,
                    description: true,
                    areaM2: true,
                    peopleCapacity: true,
                    address: true,
                    latitude: true,
                    longitude: true,
                    contactPerson: true,
                    cityHallMedia: {
                        select: {
                            url: true,
                        }
                    },
                    cityHallPricing: {
                        select: {
                            id: true,
                            activityType: true,
                            facilities: true,
                            pricePerDay: true,
                        }
                    }
                },        
            }
        ) as CityHall;

        return createdCityHall;
    }
}