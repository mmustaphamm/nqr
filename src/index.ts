import express, { Application } from "express";
import helmet from "helmet";
import router from "./routes";
import cors from "cors"
import cron from "node-cron"
import httpLogger from "./loader/logging/http";
import errorHandler from "./middleware/error-handler";
import appConfig from "./config/app";
import constant from "./constant";
import { AppDataSource } from "./data-source";
import morgan from 'morgan'
import { Utils } from "./common/Utils";
import { MerchantController } from "./features/gateway/merchant.controller";




AppDataSource.initialize().then(async () => {

    // cron.schedule('0 * * * *', async function() {
    //     await Utils.resetRoute()
    //     console.log('running a reset every 1hr', new Date());
    // });

    // cron.schedule('*/5 * * * * *', async function() {
    //     await MerchantController.queryPaymentStatus()
    //     console.log('checking for payment status every 5 secs,')
    // });

    const app: Application = express();
    app.use(express.json());
    app.use(helmet());
    app.use(morgan('dev'))
    app.use(cors());
    app.use(express.urlencoded({ extended: false }));
    app.use(httpLogger)
    app.use(router)
    app.use(errorHandler)
    app.listen(appConfig.server.port, () => console.log(constant.messages.serverUp + appConfig.server.port))

}).catch(error => console.log(error))
