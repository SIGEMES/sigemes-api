import { WebServer } from "./infrastructure/config/web";
import { prisma } from "./infrastructure/config/database";
import { RenterRepo } from "./infrastructure/repository/renter-repo";
import { RenterUsecase } from "./usecase/renter";
import { RenterController } from "./presentation/controller/renter-controller";
import { JwtService } from "./infrastructure/authentication/jwt-service";
import { BcryptService } from "./infrastructure/authentication/bcrypt-service";
import { RenterValidation } from "./infrastructure/validation/schema/renter-validation";
import { ZodValidator } from "./infrastructure/validation/zod-validator";
import { MailerService } from "./infrastructure/mailer/mailer";

import { JwtInterface } from "./domain/interface/jwt";
import { BcryptInterface } from "./domain/interface/bcrypt";
import { ValidatorInterface } from "./domain/interface/validator";
import { RenterRepoInterface } from "./domain/interface/renter-repo";
import { MailerInterface } from "./domain/interface/mailer";

export async function main(): Promise<void> {

    const jwtService: JwtInterface = new JwtService();
    const bcryptService: BcryptInterface = new BcryptService();
    const mailerService: MailerInterface = new MailerService();

    // Renter Module
    const renterValidator: ValidatorInterface = new ZodValidator(RenterValidation);
    const renterRepo: RenterRepoInterface = new RenterRepo(prisma);
    const renterUsecase: RenterUsecase = new RenterUsecase(renterValidator, renterRepo, jwtService, bcryptService, mailerService);
    const renterController: RenterController = new RenterController(renterUsecase);

    const webServer: WebServer = new WebServer(
        3000,
        renterController);
    webServer.start();
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });