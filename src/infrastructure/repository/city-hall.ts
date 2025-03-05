import { PrismaClient } from '@prisma/client';
import { CityHallRepositoryInterface } from '../../domain/interface/repository/city-hall';
import { CityHall } from '../../domain/entity/city-hall';
import { CityHallPricing } from '../../domain/entity/city-hall-pricing';
import { CityHallMedia } from '../../domain/entity/city-hall-media';

export class CityHallRepository implements CityHallRepositoryInterface {
    constructor(private prisma: PrismaClient) { }

    public async getAllCityHalls(transaction?: any): Promise<CityHall[]> {
        const prisma = transaction || this.prisma;
        const cityHalls: CityHall[] = await prisma.cityHall.findMany(
            {
                orderBy: {
                    id: 'asc',
                },
                include: {
                    cityHallMedia: {
                        orderBy: {
                            id: 'asc',
                        }
                    },
                    cityHallPricing: {
                        orderBy: {
                            id: 'asc',
                        }
                    },
                },
            }
        );

        return cityHalls;
    }

    public async getCityHallById(id: number, transaction?: any): Promise<CityHall|null> {
        const prisma = transaction || this.prisma;
        const cityHall: CityHall|null = await prisma.cityHall.findUnique(
            {
                where: {
                    id: id
                },
                include: {
                    cityHallMedia: {
                        orderBy: {
                            id: 'asc',
                        }
                    },
                    cityHallPricing: {
                        orderBy: {
                            id: 'asc',
                        }
                    },
                }
            }
        );

        return cityHall;
    }

    public async getCityHallMediaById(id: number, transaction?: any): Promise<CityHallMedia|null> {
        const prisma = transaction || this.prisma;
        const cityHallMedia: CityHallMedia|null = await prisma.cityHallMedia.findUnique(
            {
                where: {
                    id: id
                }
            }
        );

        return cityHallMedia;
    }

    public async getCityHallPricingById(id: number, transaction?: any): Promise<CityHallPricing|null> {
        const prisma = transaction || this.prisma;
        const cityHallPricing: CityHallPricing|null = await prisma.cityHallPricing.findUnique(
            {
                where: {
                    id: id
                },
            }
        );

        return cityHallPricing;
    }

    public async createCityHall(cityHall: CityHall, transaction?: any): Promise<CityHall> {
        const prisma = transaction || this.prisma;
        const createdCityHall: CityHall = await prisma.cityHall.create(
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
                            isActive: true,
                        }
                    }
                },        
            }
        ) as CityHall;

        return createdCityHall;
    }

    public async createCityHallMedia(cityHallMedia: CityHallMedia[], transaction?: any): Promise<CityHallMedia[]> {

        const prisma = transaction || this.prisma;
        const createdCityHallMedia: CityHallMedia[] = await prisma.cityHallMedia.createManyAndReturn(
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

    public async createCityHallPricing(cityHallPricing: CityHallPricing[], transaction?: any): Promise<CityHallPricing[]> {
        const prisma = transaction || this.prisma;
        const createdCityHallPricing: CityHallPricing[] = await prisma.cityHallPricing.createManyAndReturn(
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
                    isActive: true,
                },
            }
        ) as CityHallPricing[];

        return createdCityHallPricing;
    }

    public async updateCityHallOnly(id: number, cityHall: CityHall, transaction?: any): Promise<CityHall> {
        const prisma = transaction || this.prisma;
        const updatedCityHall: CityHall = await prisma.cityHall.update(
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

    public async updateCityHallPricing(cityHallPricing: CityHallPricing, transaction?: any): Promise<CityHallPricing> {
        const prisma = transaction || this.prisma;
        const updatedCityHallPricing: CityHallPricing = await prisma.cityHallPricing.update(
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

    public async deleteCityHallPricing(id: number, transaction?: any): Promise<CityHallPricing> {
        const prisma = transaction || this.prisma;
        const deletedCityHallPricing: CityHallPricing = await prisma.cityHallPricing.delete(
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

    public async deleteCityHallMedia(id: number, transaction?: any): Promise<CityHallMedia> {
        const prisma = transaction || this.prisma;
        const deletedCityHallMedia: CityHallMedia = await prisma.cityHallMedia.delete(
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

    public async deleteCityHall(id: number, transaction?: any): Promise<CityHall> {
        const prisma = transaction || this.prisma;
        const deletedCityHall: CityHall = await prisma.cityHall.delete(
            {
                where: {
                    id: id
                },
            }
        ) as CityHall;

        return deletedCityHall;
    }

    public async getAllCityHallsWithPricing(): Promise<CityHall[]> {
        const cityHalls: CityHall[] = await this.prisma.cityHall.findMany(
            {
                select: {
                    name: true,
                    cityHallPricing: {
                        select: {
                            id: true,
                        },
                    },
                },
            }
        ) as CityHall[];

        return cityHalls;
    }
}