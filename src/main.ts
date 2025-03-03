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

import { RentRepository } from "./infrastructure/repository/rent";
import { RentUsecase } from "./usecase/rent";
import { RentController } from "./presentation/controller/rent";

import { PaymentRepository } from "./infrastructure/repository/payment";
import { PaymentUsecase } from "./usecase/payment";
import { PaymentController } from "./presentation/controller/payment";

import { DashboardUsecase } from "./usecase/dashboard";
import { DashboardController } from "./presentation/controller/dashboard";

import { JwtService } from "./infrastructure/authentication/jwt";
import { BcryptService } from "./infrastructure/authentication/bcrypt";
import { CryptoService } from "./infrastructure/authentication/crypto";
import { MailerService } from "./infrastructure/mailer/mailer";
import { CloudStorageService } from "./infrastructure/object-storage/cloud-storage";
import { MidtransService } from "./infrastructure/payment-gateway/midtrans";
import { DbTransaction } from "./infrastructure/repository/db-transaction";

import { JwtInterface } from "./domain/interface/library/jwt";
import { BcryptInterface } from "./domain/interface/library/bcrypt";
import { CryptoInterface } from "./domain/interface/library/crypto";
import { RenterRepositoryInterface } from "./domain/interface/repository/renter";
import { AdminRepositoryInterface } from "./domain/interface/repository/admin";
import { CityHallRepositoryInterface } from "./domain/interface/repository/city-hall";
import { GuesthouseRepositoryInterface } from "./domain/interface/repository/guesthouse";
import { GuesthouseRoomRepositoryInterface } from "./domain/interface/repository/guesthouse-room";
import { RentRepositoryInterface } from "./domain/interface/repository/rent";
import { MailerInterface } from "./domain/interface/external-service/mailer";
import { ObjectStorageInterface } from "./domain/interface/external-service/object-storage";
import { DbTransactionInterface } from "./domain/interface/repository/db-transaction";
import { PaymentGatewayInterface } from "./domain/interface/external-service/payment-gateway";
import { APIRouter } from "./presentation/router/api";

export async function main(): Promise<void> {

    // Third Party Library or External Service Instance
    const jwtService: JwtInterface = new JwtService();
    const bcryptService: BcryptInterface = new BcryptService();
    const cryptoService: CryptoInterface = new CryptoService();
    const mailerService: MailerInterface = new MailerService();
    const objectStorageService: ObjectStorageInterface = new CloudStorageService();
    const paymentGatewayService: PaymentGatewayInterface = new MidtransService();
    const dbTransaction: DbTransactionInterface = new DbTransaction(prisma);
    
    // Repository Instance
    const renterRepository: RenterRepositoryInterface = new RenterRepository(prisma);
    const adminRepository: AdminRepositoryInterface = new AdminRepository(prisma);
    const cityHallRepository: CityHallRepositoryInterface = new CityHallRepository(prisma);
    const guesthouseRepository: GuesthouseRepositoryInterface = new GuesthouseRepository(prisma);
    const guesthouseRoomRepository: GuesthouseRoomRepositoryInterface = new GuesthouseRoomRepository(prisma);
    const rentRepository: RentRepositoryInterface = new RentRepository(prisma);
    const paymentRepository: PaymentRepository = new PaymentRepository(prisma);
    
    // Usecase Instance
    const renterUsecase: RenterUsecase = new RenterUsecase(renterRepository, jwtService, bcryptService, mailerService, objectStorageService);
    const adminUsecase: AdminUsecase = new AdminUsecase(adminRepository, jwtService, bcryptService, objectStorageService);
    const cityHallUsecase: CityHallUsecase = new CityHallUsecase(cityHallRepository, rentRepository, objectStorageService, dbTransaction);
    const guesthouseUsecase: GuesthouseUsecase = new GuesthouseUsecase(guesthouseRepository, objectStorageService, dbTransaction);
    const guesthouseRoomUsecase: GuesthouseRoomUsecase = new GuesthouseRoomUsecase(guesthouseRoomRepository, rentRepository, objectStorageService, dbTransaction);
    const rentUsecase: RentUsecase = new RentUsecase(rentRepository, guesthouseRoomRepository, cityHallRepository, paymentRepository, dbTransaction, paymentGatewayService, cryptoService);
    const paymentUsecase: PaymentUsecase = new PaymentUsecase(paymentRepository, rentRepository, dbTransaction, paymentGatewayService, cryptoService);
    const dashboardUsecase: DashboardUsecase = new DashboardUsecase(rentRepository, paymentRepository);
    
    // Controller Instance
    const renterController: RenterController = new RenterController(renterUsecase);
    const adminController: AdminController = new AdminController(adminUsecase);
    const cityHallController: CityHallController = new CityHallController(cityHallUsecase);
    const guesthouseRoomController: GuesthouseRoomController = new GuesthouseRoomController(guesthouseRoomUsecase);
    const guesthouseController: GuesthouseController = new GuesthouseController(guesthouseUsecase);
    const rentController: RentController = new RentController(rentUsecase);
    const paymentController: PaymentController = new PaymentController(paymentUsecase);
    const dashboardController: DashboardController = new DashboardController(dashboardUsecase);

    const router: APIRouter = new APIRouter(
        renterController,
        adminController,
        cityHallController,
        guesthouseController,
        guesthouseRoomController,
        rentController,
        paymentController,
        dashboardController,
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