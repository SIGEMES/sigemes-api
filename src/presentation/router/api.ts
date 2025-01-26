import express from 'express';
import { RenterController } from '../controller/renter';
import { jwtMiddleware } from '../middleware/jwt-middleware';
import { isRenterMiddleware } from '../middleware/is-renter-middleware';
import multer from 'multer';

export class APIRouter {
    public multerUpload: multer.Multer;
    public renterRouter: express.Router;

    constructor(
        private renterController: RenterController
    ) {
        this.multerUpload = multer({
            storage: multer.memoryStorage(),
            limits: {
                fileSize: 5 * 1024 * 1024,
            },
        });

        this.renterRouter = express.Router();
        this.configRentersRoutes();
    }

    private configRentersRoutes(): void {
        this.renterRouter.post("/login", this.renterController.login.bind(this.renterController));
        this.renterRouter.post("/register", this.renterController.register.bind(this.renterController));
        this.renterRouter.post("/email/send-otp", this.renterController.sendEmailVerificationOTP.bind(this.renterController));
        this.renterRouter.post("/email/verify-otp", this.renterController.verifyEmailVerificationOTP.bind(this.renterController));
        this.renterRouter.post("/forgot-password/send-otp", this.renterController.sendForgotPasswordOTP.bind(this.renterController));
        this.renterRouter.post("/forgot-password/verify-otp", this.renterController.verifyForgotPasswordOTP.bind(this.renterController));
        this.renterRouter.put("/forgot-password/change-password", this.renterController.changePasswordForgotPassword.bind(this.renterController));
        this.renterRouter.use(jwtMiddleware, isRenterMiddleware);
        this.renterRouter.get("", this.renterController.getRenterData.bind(this.renterController));
        this.renterRouter.put("/change-password", this.renterController.changePassword.bind(this.renterController));
        this.renterRouter.put("/update-profile", this.multerUpload.single('profile_picture'), this.renterController.updateProfile.bind(this.renterController));
    }
}