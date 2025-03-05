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
import { RentController } from '../controller/rent';
import { PaymentController } from '../controller/payment';
import { ReviewController } from '../controller/review';

export class APIRouter {
    public multerUpload: multer.Multer;
    public renterRouter: express.Router;
    public adminRouter: express.Router;
    public cityHallRouter: express.Router;
    public guesthouseRouter: express.Router;
    public rentRouter: express.Router;
    public paymentRouter: express.Router;

    constructor(
        private renterController: RenterController,
        private adminController: AdminController,
        private cityHallController: CityHallController,
        private guesthouseController: GuesthouseController,
        private guesthouseRoomController: GuesthouseRoomController,
        private rentController: RentController,
        private paymentController: PaymentController,
        private reviewController: ReviewController,
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
        this.guesthouseRouter = express.Router();
        this.rentRouter = express.Router();
        this.paymentRouter = express.Router();

        this.configRentersRoutes();
        this.configAdminRoutes();
        this.configCityHallRoutes();
        this.configGuesthouseRoutes();
        this.configRentRoutes()
        this.configPaymentRoutes();
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
        this.cityHallRouter.get("/:id/reviews", this.reviewController.getReviewsByCityHallId.bind(this.reviewController));
        this.cityHallRouter.use(isAdminMiddleware);
        this.cityHallRouter.post("", this.multerUpload.array('city_hall_media'), this.cityHallController.createCityHall.bind(this.cityHallController));
        this.cityHallRouter.put("/:id", this.multerUpload.array('city_hall_media'), this.cityHallController.updateCityHall.bind(this.cityHallController));
        this.cityHallRouter.delete("/:id", this.cityHallController.deleteCityHall.bind(this.cityHallController));
    }

    private configGuesthouseRoutes(): void {
        this.guesthouseRouter.use(jwtMiddleware);
        this.guesthouseRouter.get("", this.guesthouseController.getAllGuesthouses.bind(this.guesthouseController));
        this.guesthouseRouter.get("/:id", this.guesthouseController.getGuesthouseById.bind(this.guesthouseController));
        this.guesthouseRouter.get("/:guesthouse_id/rooms", this.guesthouseRoomController.getAllGuesthouseRooms.bind(this.guesthouseRoomController));
        this.guesthouseRouter.get("/:guesthouse_id/rooms/:room_id", this.guesthouseRoomController.getGuesthouseRoomById.bind(this.guesthouseRoomController));
        this.guesthouseRouter.get("/:guesthouse_id/rooms/:room_id/reviews", this.reviewController.getReviewsByGuesthouseRoomId.bind(this.reviewController));
        
        this.guesthouseRouter.use(isAdminMiddleware);
        this.guesthouseRouter.post("", this.multerUpload.array('guesthouse_media'), this.guesthouseController.createGuesthouse.bind(this.guesthouseController));
        this.guesthouseRouter.put("/:id", this.multerUpload.array('guesthouse_media'), this.guesthouseController.updateGuesthouse.bind(this.guesthouseController));
        this.guesthouseRouter.delete("/:id", this.guesthouseController.deleteGuesthouse.bind(this.guesthouseController));
        this.guesthouseRouter.post("/:guesthouse_id/rooms", this.multerUpload.array('room_media'), this.guesthouseRoomController.createGuesthouseRoom.bind(this.guesthouseRoomController));
        this.guesthouseRouter.put("/:guesthouse_id/rooms/:room_id", this.multerUpload.array('room_media'), this.guesthouseRoomController.updateGuesthouseRoom.bind(this.guesthouseRoomController));
        this.guesthouseRouter.delete("/:guesthouse_id/rooms/:room_id", this.guesthouseRoomController.deleteGuesthouseRoom.bind(this.guesthouseRoomController));
    }

    private configRentRoutes(): void {
        this.rentRouter.use(jwtMiddleware);
        this.rentRouter.get("", this.rentController.getAllRents.bind(this.rentController));
        this.rentRouter.get("/:id", this.rentController.getRentById.bind(this.rentController));
        this.rentRouter.post("", this.rentController.createRent.bind(this.rentController));
        this.rentRouter.put("/:id", this.rentController.cancelRent.bind(this.rentController));
        this.rentRouter.put("/:id/renew-payment", this.paymentController.renewPaymentGatewayToken.bind(this.paymentController));
        this.rentRouter.get("/:rent_id/reviews", this.reviewController.getReviewByRentId.bind(this.reviewController));
        this.rentRouter.post("/:rent_id/reviews", this.multerUpload.array('media'), this.reviewController.createReview.bind(this.reviewController));
        this.rentRouter.put("/:rent_id/reviews/:review_id", this.multerUpload.array('media'), this.reviewController.updateReview.bind(this.reviewController));
        this.rentRouter.use(isAdminMiddleware);
        this.rentRouter.put("/:id/check-in", this.rentController.checkInRent.bind(this.rentController));
        this.rentRouter.put("/:id/check-out", this.rentController.checkOutRent.bind(this.rentController));
        this.rentRouter.post("/:rent_id/reviews/:review_id/replies", this.reviewController.createReviewReply.bind(this.reviewController));
        this.rentRouter.put("/:rent_id/reviews/:review_id/replies/:reply_id", this.reviewController.updateReviewReply.bind(this.reviewController));
        this.rentRouter.delete("/:rent_id/reviews/:review_id/replies/:reply_id", this.reviewController.deleteReviewReply.bind(this.reviewController));
    }

    private configPaymentRoutes(): void {
        this.paymentRouter.post("/handle-notification", this.paymentController.handlePaymentNotification.bind(this.paymentController));
        this.paymentRouter.use(jwtMiddleware);
    }
}