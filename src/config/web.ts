import express from 'express';
import { APIRouter } from '../presentation/router/api';
import { RenterController } from '../presentation/controller/renter-controller';
import { errorMiddleware } from '../presentation/middleware/error-middleware';

export class WebServer {
    private app: express.Application;
    private port: number;
    private APIRouter: APIRouter;

    constructor(
        port: number,
        renterController: RenterController
    ) {
        this.app = express();
        this.port = port;
        this.APIRouter = new APIRouter(
            renterController
        );

        this.app.use(express.json());
        this.app.use("/api/v1/renters", this.APIRouter.renterRouter);
        this.app.use(errorMiddleware);
    }

    public start(): void {
        this.app.listen(this.port, () => {
            console.log(`Server started at http://localhost:${this.port}`);
        });
    }
}