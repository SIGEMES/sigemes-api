import express from 'express';
import { RenterController } from '../controller/renter-controller';

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
    }
}