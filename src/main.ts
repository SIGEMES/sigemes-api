import { WebServer } from "./infrastructure/config/web";
import { prisma } from "./infrastructure/config/database";
import { RenterRepo } from "./infrastructure/repository/renter";
import { RenterUsecase } from "./usecase/renter";
import { RenterController } from "./presentation/controller/renter";

import { AdminRepository } from "./infrastructure/repository/admin";
import { AdminUsecase } from "./usecase/admin";
import { AdminController } from "./presentation/controller/admin";

import { JwtService } from "./infrastructure/authentication/jwt";
import { BcryptService } from "./infrastructure/authentication/bcrypt";
import { MailerService } from "./infrastructure/mailer/mailer";

import { JwtInterface } from "./domain/interface/library/jwt";
import { BcryptInterface } from "./domain/interface/library/bcrypt";
import { RenterRepositoryInterface } from "./domain/interface/repository/renter";
import { AdminRepositoryInterface } from "./domain/interface/repository/admin";
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
    const renterRepo: RenterRepositoryInterface = new RenterRepo(prisma);
    const renterUsecase: RenterUsecase = new RenterUsecase(renterRepo, jwtService, bcryptService, mailerService, objectStorageService);
    const renterController: RenterController = new RenterController(renterUsecase);

    // Admin Module
    const adminRepository: AdminRepositoryInterface = new AdminRepository(prisma);
    const adminUsecase: AdminUsecase = new AdminUsecase(adminRepository, jwtService, bcryptService, objectStorageService);
    const adminController: AdminController = new AdminController(adminUsecase);

    const router: APIRouter = new APIRouter(
        renterController,
        adminController,
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