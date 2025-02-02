import { WebServer } from "./infrastructure/config/web";
import { prisma } from "./infrastructure/config/database";
import { RenterRepository } from "./infrastructure/repository/renter";
import { RenterUsecase } from "./usecase/renter";
import { RenterController } from "./presentation/controller/renter";

import { AdminRepository } from "./infrastructure/repository/admin";
import { AdminUsecase } from "./usecase/admin";
import { AdminController } from "./presentation/controller/admin";

import { CityHallRepository } from "./infrastructure/repository/city-hall";
import { CityHallUsecase } from "./usecase/city-hall";
import { CityHallController } from "./presentation/controller/city-hall";

import { JwtService } from "./infrastructure/authentication/jwt";
import { BcryptService } from "./infrastructure/authentication/bcrypt";
import { MailerService } from "./infrastructure/mailer/mailer";

import { JwtInterface } from "./domain/interface/library/jwt";
import { BcryptInterface } from "./domain/interface/library/bcrypt";
import { RenterRepositoryInterface } from "./domain/interface/repository/renter";
import { AdminRepositoryInterface } from "./domain/interface/repository/admin";
import { CityHallRepositoryInterface } from "./domain/interface/repository/city-hall";
import { MailerInterface } from "./domain/interface/external-service/mailer";
import { ObjectStorageInterface } from "./domain/interface/external-service/object-storage";
import { CloudStorageService } from "./infrastructure/object-storage/cloud-storage";
import { APIRouter } from "./presentation/router/api";

export async function main(): Promise<void> {

    const jwtService: JwtInterface = new JwtService();
    const bcryptService: BcryptInterface = new BcryptService();
    const mailerService: MailerInterface = new MailerService();
    const objectStorageService: ObjectStorageInterface = new CloudStorageService();

    // Renter Module
    const renterRepository: RenterRepositoryInterface = new RenterRepository(prisma);
    const renterUsecase: RenterUsecase = new RenterUsecase(renterRepository, jwtService, bcryptService, mailerService, objectStorageService);
    const renterController: RenterController = new RenterController(renterUsecase);

    // Admin Module
    const adminRepository: AdminRepositoryInterface = new AdminRepository(prisma);
    const adminUsecase: AdminUsecase = new AdminUsecase(adminRepository, jwtService, bcryptService, objectStorageService);
    const adminController: AdminController = new AdminController(adminUsecase);

    // City Hall Module
    const cityHallRepository: CityHallRepositoryInterface = new CityHallRepository(prisma);
    const cityHallUsecase: CityHallUsecase = new CityHallUsecase(cityHallRepository);
    const cityHallController: CityHallController = new CityHallController(cityHallUsecase);

    const router: APIRouter = new APIRouter(
        renterController,
        adminController,
        cityHallController,
    );

    const webServer: WebServer = new WebServer(
        8080,
        router);
    webServer.start();
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });