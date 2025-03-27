import express from 'express';
import cors from 'cors';
import { APIRouter } from '../../presentation/router/api';
import { errorMiddleware } from '../../presentation/middleware/error';

export class WebServer {
    private app: express.Application;
    private port: number;
    private APIRouter: APIRouter;

    constructor(
        port: number,
        APIRouter: APIRouter
    ) {
        this.app = express();
        this.port = port;
        this.APIRouter = APIRouter;

        this.app.use(express.json());
        this.app.use(cors());
        this.app.get("/api/v1/docs", (req, res) => {
            res.redirect("https://documenter.getpostman.com/view/31634961/2sAYQamX7E");
        });
        this.app.use("/api/v1/renters", this.APIRouter.renterRouter);
        this.app.use("/api/v1/admins", this.APIRouter.adminRouter);
        this.app.use("/api/v1/city-halls", this.APIRouter.cityHallRouter);
        this.app.use("/api/v1/guesthouses", this.APIRouter.guesthouseRouter);
        this.app.use("/api/v1/rents", this.APIRouter.rentRouter);
        this.app.use("/api/v1/payments", this.APIRouter.paymentRouter);
        this.app.use("/api/v1/dashboard", this.APIRouter.dashboardRouter);
        this.app.use(errorMiddleware);
    }

    public start(): void {
        this.app.listen(this.port, () => {
            console.log(`Server started at http://localhost:${this.port}`);
        });
    }
}