import express from 'express';
import { RenterController } from '../controller/renter';
import { jwtMiddleware } from '../middleware/jwt';
import { isRenterMiddleware } from '../middleware/is-renter';
import multer from 'multer';
import { AdminController } from '../controller/admin';
import { isAdminMiddleware } from '../middleware/is-admin';
import { isSuperAdminMiddleware } from '../middleware/is-super-admin';
import { CityHallController } from '../controller/city-hall';
import { GuesthouseController } from '../controller/guesthouse';
import { GuesthouseRoomController } from '../controller/guesthouse-room';

export class APIRouter {
    public multerUpload: multer.Multer;
    public renterRouter: express.Router;
    public adminRouter: express.Router;
    public cityHallRouter: express.Router;
    public guesthouseRouter: express.Router;
    public guesthouseRoomRouter: express.Router;

    constructor(
        private renterController: RenterController,
        private adminController: AdminController,
        private cityHallController: CityHallController,
        private guesthouseController: GuesthouseController,
        private guesthouseRoomController: GuesthouseRoomController
    ) {
        this.multerUpload = multer({
            storage: multer.memoryStorage(),
            limits: {
                fileSize: 5 * 1024 * 1024,
            },
        });

        this.renterRouter = express.Router();
        this.adminRouter = express.Router();
        this.cityHallRouter = express.Router();
        this.guesthouseRoomRouter = express.Router();
        this.guesthouseRouter = express.Router();

        this.configRentersRoutes();
        this.configAdminRoutes();
        this.configCityHallRoutes();
        this.configGuesthouseRoomRoutes();
        this.configGuesthouseRoutes();
    }

    private configRentersRoutes(): void {
        this.renterRouter.post("/login", this.renterController.login.bind(this.renterController));
        this.renterRouter.post("/register", this.renterController.register.bind(this.renterController));
        this.renterRouter.post("/email/send-otp", this.renterController.sendEmailVerificationOTP.bind(this.renterController));
        this.renterRouter.post("/email/verify-otp", this.renterController.verifyEmailVerificationOTP.bind(this.renterController));
        this.renterRouter.post("/forgot-password/send-otp", this.renterController.sendForgotPasswordOTP.bind(this.renterController));
        this.renterRouter.post("/forgot-password/verify-otp", this.renterController.verifyForgotPasswordOTP.bind(this.renterController));
        this.renterRouter.put("/forgot-password/change-password", this.renterController.changePasswordForgotPassword.bind(this.renterController));
        this.renterRouter.use(jwtMiddleware);
        this.renterRouter.get("/:id", this.renterController.getRenterById.bind(this.renterController));
        this.renterRouter.use(isRenterMiddleware);
        this.renterRouter.put("/:id", this.multerUpload.single('profile_picture'), this.renterController.updateProfile.bind(this.renterController));
        this.renterRouter.put("/:id/password", this.renterController.changePassword.bind(this.renterController));
    }

    private configAdminRoutes(): void {
        this.adminRouter.post("/login", this.adminController.login.bind(this.adminController));
        this.adminRouter.use(jwtMiddleware, isAdminMiddleware);
        this.adminRouter.get("", this.adminController.getAllAdmin.bind(this.adminController));
        this.adminRouter.get("/:id", this.adminController.getAdminById.bind(this.adminController));
        this.adminRouter.use(isSuperAdminMiddleware);
        this.adminRouter.post("", this.adminController.createAdmin.bind(this.adminController));
        this.adminRouter.put("/:id", this.multerUpload.single('profile_picture'), this.adminController.updateAdmin.bind(this.adminController));
        this.adminRouter.delete("/:id", this.adminController.deleteAdmin.bind(this.adminController));
    }

    private configCityHallRoutes(): void {
        this.cityHallRouter.use(jwtMiddleware);
        this.cityHallRouter.get("", this.cityHallController.getAllCityHalls.bind(this.cityHallController));
        this.cityHallRouter.get("/:id", this.cityHallController.getCityHallById.bind(this.cityHallController));
        this.cityHallRouter.use(isAdminMiddleware);
        this.cityHallRouter.post("", this.multerUpload.array('city_hall_images'), this.cityHallController.createCityHall.bind(this.cityHallController));
        this.cityHallRouter.put("/:id", this.multerUpload.array('city_hall_images'), this.cityHallController.updateCityHall.bind(this.cityHallController));
        this.cityHallRouter.delete("/:id", this.cityHallController.deleteCityHall.bind(this.cityHallController));
    }

    private configGuesthouseRoomRoutes(): void {
        this.guesthouseRoomRouter.use(jwtMiddleware);
        this.guesthouseRoomRouter.get("/:guesthouse_id/rooms", this.guesthouseRoomController.getAllGuesthouseRooms.bind(this.guesthouseRoomController));
        this.guesthouseRoomRouter.get("/:guesthouse_id/rooms/:room_id", this.guesthouseRoomController.getGuesthouseRoomById.bind(this.guesthouseRoomController));
        this.guesthouseRoomRouter.use(isAdminMiddleware);
        this.guesthouseRoomRouter.post("/:guesthouse_id/rooms", this.multerUpload.array('room_media'), this.guesthouseRoomController.createGuesthouseRoom.bind(this.guesthouseRoomController));
        this.guesthouseRoomRouter.put("/:guesthouse_id/rooms/:room_id", this.multerUpload.array('room_media'), this.guesthouseRoomController.updateGuesthouseRoom.bind(this.guesthouseRoomController));
    }

    private configGuesthouseRoutes(): void {
        this.guesthouseRouter.use(jwtMiddleware);
        this.guesthouseRouter.get("", this.guesthouseController.getAllGuesthouses.bind(this.guesthouseController));
        this.guesthouseRouter.get("/:id", this.guesthouseController.getGuesthouseById.bind(this.guesthouseController));
        this.guesthouseRouter.use(isAdminMiddleware);
        this.guesthouseRouter.post("", this.multerUpload.array('guesthouse_media'), this.guesthouseController.createGuesthouse.bind(this.guesthouseController));
        this.guesthouseRouter.put("/:id", this.multerUpload.array('guesthouse_media'), this.guesthouseController.updateGuesthouse.bind(this.guesthouseController));
        this.guesthouseRouter.delete("/:id", this.guesthouseController.deleteGuesthouse.bind(this.guesthouseController));
    }
    
    
}