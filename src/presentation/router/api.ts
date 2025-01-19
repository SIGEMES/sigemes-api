import express from 'express';
import { RenterController } from '../controller/renter-controller';
import { jwtMiddleware } from '../middleware/jwt-middleware';
import { isRenterMiddleware } from '../middleware/is-renter-middleware';

export class APIRouter {
    public renterRouter: express.Router;

    constructor(
        private renterController: RenterController
    ) {
        this.renterRouter = express.Router();
        this.configRentersRoutes();
    }

    private configRentersRoutes(): void {
        this.renterRouter.get("/login", this.renterController.login.bind(this.renterController));
        this.renterRouter.use(jwtMiddleware, isRenterMiddleware);
        this.renterRouter.get("", this.renterController.getRenterData.bind(this.renterController));
    }
}