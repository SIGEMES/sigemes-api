import { WebServer } from "./infrastructure/config/web";
import { prisma } from "./infrastructure/config/database";
import { RenterRepo } from "./infrastructure/repository/renter-repo";
import { RenterUsecase } from "./usecase/renter";
import { RenterController } from "./presentation/controller/renter-controller";
import { JwtService } from "./infrastructure/authentication/jwt-service";
import { BcryptService } from "./infrastructure/authentication/bcrypt-service";
import { MailerService } from "./infrastructure/mailer/mailer";

import { JwtInterface } from "./domain/interface/jwt";
import { BcryptInterface } from "./domain/interface/bcrypt";
import { RenterRepoInterface } from "./domain/interface/renter-repo";
import { MailerInterface } from "./domain/interface/mailer";
import { ObjectStorageInterface } from "./domain/interface/object-storage";
import { CloudStorageService } from "./infrastructure/object-storage/cloud-storage";
import { APIRouter } from "./presentation/router/api";

export async function main(): Promise<void> {

    const jwtService: JwtInterface = new JwtService();
    const bcryptService: BcryptInterface = new BcryptService();
    const mailerService: MailerInterface = new MailerService();
    const objectStorageService: ObjectStorageInterface = new CloudStorageService();

    // Renter Module
    const renterRepo: RenterRepoInterface = new RenterRepo(prisma);
    const renterUsecase: RenterUsecase = new RenterUsecase(renterRepo, jwtService, bcryptService, mailerService, objectStorageService);
    const renterController: RenterController = new RenterController(renterUsecase);

    const router: APIRouter = new APIRouter(
        renterController
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