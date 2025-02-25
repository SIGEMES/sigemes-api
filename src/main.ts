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

import { GuesthouseRepository } from "./infrastructure/repository/guesthouse";
import { GuesthouseUsecase } from "./usecase/guesthouse";
import { GuesthouseController } from "./presentation/controller/guesthouse";

import { GuesthouseRoomRepository } from "./infrastructure/repository/guesthouse-room";
import { GuesthouseRoomUsecase } from "./usecase/guesthouse-room";
import { GuesthouseRoomController } from "./presentation/controller/guesthouse-room";

import { RentPlanRepository } from "./infrastructure/repository/rent-plan";
import { RentPlanUsecase } from "./usecase/rent-plan";
import { RentPlanController } from "./presentation/controller/rent-plan";

import { RentRepository } from "./infrastructure/repository/rent";
import { RentUsecase } from "./usecase/rent";
import { RentController } from "./presentation/controller/rent";

import { JwtService } from "./infrastructure/authentication/jwt";
import { BcryptService } from "./infrastructure/authentication/bcrypt";
import { MailerService } from "./infrastructure/mailer/mailer";
import { DbTransaction } from "./infrastructure/repository/db-transaction";

import { JwtInterface } from "./domain/interface/library/jwt";
import { BcryptInterface } from "./domain/interface/library/bcrypt";
import { RenterRepositoryInterface } from "./domain/interface/repository/renter";
import { AdminRepositoryInterface } from "./domain/interface/repository/admin";
import { CityHallRepositoryInterface } from "./domain/interface/repository/city-hall";
import { GuesthouseRepositoryInterface } from "./domain/interface/repository/guesthouse";
import { GuesthouseRoomRepositoryInterface } from "./domain/interface/repository/guesthouse-room";
import { RentPlanRepositoryInterface } from "./domain/interface/repository/rent-plan";
import { RentRepositoryInterface } from "./domain/interface/repository/rent";
import { MailerInterface } from "./domain/interface/external-service/mailer";
import { ObjectStorageInterface } from "./domain/interface/external-service/object-storage";
import { CloudStorageService } from "./infrastructure/object-storage/cloud-storage";
import { DbTransactionInterface } from "./domain/interface/repository/db-transaction";
import { APIRouter } from "./presentation/router/api";

export async function main(): Promise<void> {

    const jwtService: JwtInterface = new JwtService();
    const bcryptService: BcryptInterface = new BcryptService();
    const mailerService: MailerInterface = new MailerService();
    const objectStorageService: ObjectStorageInterface = new CloudStorageService();
    const dbTransaction: DbTransactionInterface = new DbTransaction(prisma);

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
    const cityHallUsecase: CityHallUsecase = new CityHallUsecase(cityHallRepository, objectStorageService, dbTransaction);
    const cityHallController: CityHallController = new CityHallController(cityHallUsecase);

    // Guesthouse Room Module
    const guesthouseRoomRepository: GuesthouseRoomRepositoryInterface = new GuesthouseRoomRepository(prisma);
    const guesthouseRoomUsecase: GuesthouseRoomUsecase = new GuesthouseRoomUsecase(guesthouseRoomRepository, objectStorageService, dbTransaction);
    const guesthouseRoomController: GuesthouseRoomController = new GuesthouseRoomController(guesthouseRoomUsecase);

    // Guesthouse Module
    const guesthouseRepository: GuesthouseRepositoryInterface = new GuesthouseRepository(prisma);
    const guesthouseUsecase: GuesthouseUsecase = new GuesthouseUsecase(guesthouseRepository, objectStorageService, dbTransaction);
    const guesthouseController: GuesthouseController = new GuesthouseController(guesthouseUsecase);

    // Rent Plan Module
    const rentPlanRepository: RentPlanRepositoryInterface = new RentPlanRepository(prisma);
    const rentPlanUsecase: RentPlanUsecase = new RentPlanUsecase(rentPlanRepository, guesthouseRoomRepository, cityHallRepository, dbTransaction);
    const rentPlanController: RentPlanController = new RentPlanController(rentPlanUsecase);

    // Rent Module
    const rentRepository: RentRepositoryInterface = new RentRepository(prisma);
    const rentUsecase: RentUsecase = new RentUsecase(rentRepository, guesthouseRoomRepository, cityHallRepository, dbTransaction);
    const rentController: RentController = new RentController(rentUsecase);

    const router: APIRouter = new APIRouter(
        renterController,
        adminController,
        cityHallController,
        guesthouseController,
        guesthouseRoomController,
        rentPlanController,
        rentController,
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