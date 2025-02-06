import { PrismaClient } from '@prisma/client';
import { CityHallRepositoryInterface } from '../../domain/interface/repository/city-hall';
import { CityHall } from '../../domain/entity/city-hall';
import { CityHallPricing } from '../../domain/entity/city-hall-pricing';
import { CityHallMedia } from '../../domain/entity/city-hall-media';

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

    public async getCityHallMediaById(id: number): Promise<CityHallMedia|null> {
        const cityHallMedia: CityHallMedia|null = await this.prisma.cityHallMedia.findUnique(
            {
                where: {
                    id: id
                }
            }
        );

        return cityHallMedia;
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
                            id: true,
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

    public async createCityHallMedia(cityHallMedia: CityHallMedia[]): Promise<CityHallMedia[]> {

        const createdCityHallMedia: CityHallMedia[] = await this.prisma.cityHallMedia.createManyAndReturn(
            {
                data: cityHallMedia.map(media => ({
                    cityHallId: media.cityHallId,
                    url: media.url,
                })),
                select: {
                    id: true,
                    url: true,
                },
            }
        ) as CityHallMedia[];

        return createdCityHallMedia;
    }

    public async createCityHallPricing(cityHallPricing: CityHallPricing[]): Promise<CityHallPricing[]> {
        const createdCityHallPricing: CityHallPricing[] = await this.prisma.cityHallPricing.createManyAndReturn(
            {
                data: cityHallPricing.map(pricing => ({
                    cityHallId: pricing.cityHallId,
                    activityType: pricing.activityType,
                    facilities: pricing.facilities,
                    pricePerDay: pricing.pricePerDay,
                })),
                select: {
                    id: true,
                    activityType: true,
                    facilities: true,
                    pricePerDay: true,
                },
            }
        ) as CityHallPricing[];

        return createdCityHallPricing;
    }

    public async updateCityHallOnly(id: number, cityHall: CityHall): Promise<CityHall> {
        const updatedCityHall: CityHall = await this.prisma.cityHall.update(
            {
                where: {
                    id: id
                },
                data: {
                    name: cityHall.name,
                    description: cityHall.description,
                    areaM2: cityHall.areaM2,
                    peopleCapacity: cityHall.peopleCapacity,
                    address: cityHall.address,
                    latitude: cityHall.latitude,
                    longitude: cityHall.longitude,
                    contactPerson: cityHall.contactPerson,
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
                },
            }
        ) as CityHall;

        return updatedCityHall;
    }

    public async updateCityHallPricing(cityHallPricing: CityHallPricing): Promise<CityHallPricing> {
        const updatedCityHallPricing: CityHallPricing = await this.prisma.cityHallPricing.update(
            {
                where: {
                    id: cityHallPricing.id
                },
                data: {
                    activityType: cityHallPricing.activityType,
                    facilities: cityHallPricing.facilities,
                    pricePerDay: cityHallPricing.pricePerDay,
                },
                select: {
                    id: true,
                    activityType: true,
                    facilities: true,
                    pricePerDay: true,
                },
            }
        ) as CityHallPricing;

        return updatedCityHallPricing;
    }

    public async deleteCityHallPricing(id: number): Promise<CityHallPricing> {
        const deletedCityHallPricing: CityHallPricing = await this.prisma.cityHallPricing.delete(
            {
                where: {
                    id: id
                },
                select: {
                    id: true,
                    activityType: true,
                    facilities: true,
                    pricePerDay: true,
                },
            }
        ) as CityHallPricing;

        return deletedCityHallPricing;
    }

    public async deleteCityHallMedia(id: number): Promise<CityHallMedia> {
        const deletedCityHallMedia: CityHallMedia = await this.prisma.cityHallMedia.delete(
            {
                where: {
                    id: id
                },
                select: {
                    id: true,
                    url: true,
                },
            }
        ) as CityHallMedia;

        return deletedCityHallMedia;
    }
}