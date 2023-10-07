// import app from "./app";
import express, { Application } from "express";
import helmet from "helmet";
import router from "./routes";
import cors from "cors"
import httpLogger from "./loader/logging/http";
import errorHandler from "./middleware/error-handler";
import appConfig from "./config/app";
import constant from "./constant";
import { AppDataSource } from "./data-source";
import morgan from 'morgan'



AppDataSource.initialize().then(async () => {

    const app: Application = express();
    app.use(express.json());
    app.use(helmet());
    app.use(morgan('dev'))
    app.use(cors());
    app.use(express.urlencoded({ extended: false }));
    app.use(httpLogger)
    app.use(router)
    app.use(errorHandler)
    app.listen(3001, () => console.log(constant.messages.serverUp + appConfig.server.port))

}).catch(error => console.log(error))
