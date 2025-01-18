import { WebServer } from "./config/web";
import { prisma } from "./config/database";
import { RenterRepo } from "./infrastructure/repository/renter-repo";
import { RenterRepoInterface } from "./domain/interface/renter-repo";
import { RenterUsecase } from "./usecase/renter";
import { RenterController } from "./presentation/controller/renter-controller";
import { JwtService } from "./infrastructure/authentication/jwt-service";
import { BcryptService } from "./infrastructure/authentication/bcrypt-service";
import { RenterValidation } from "./infrastructure/validation/schema/renter-validation";
import { ZodValidator } from "./infrastructure/validation/zod-validator";
import { ValidatorInterface } from "./domain/interface/validator";

export async function main(): Promise<void> {

    // Renter Module
    const renterValidator: ValidatorInterface = new ZodValidator(RenterValidation);
    const jwtService: JwtService = new JwtService();
    const bcryptService: BcryptService = new BcryptService();
    const renterRepo: RenterRepoInterface = new RenterRepo(prisma);
    const renterUsecase: RenterUsecase = new RenterUsecase(renterValidator, renterRepo, jwtService, bcryptService);
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