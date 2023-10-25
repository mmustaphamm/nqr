"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const routes_1 = __importDefault(require("./routes"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("./loader/logging/http"));
const error_handler_1 = __importDefault(require("./middleware/error-handler"));
const app_1 = __importDefault(require("./config/app"));
const constant_1 = __importDefault(require("./constant"));
const data_source_1 = require("./data-source");
const morgan_1 = __importDefault(require("morgan"));
data_source_1.AppDataSource.initialize().then(() => __awaiter(void 0, void 0, void 0, function* () {
    // cron.schedule('0 * * * *', async function() {
    //     await Utils.resetRoute()
    //     console.log('running a reset every 1hr', new Date());
    // });
    // cron.schedule('*/5 * * * * *', async function() {
    //     await MerchantController.queryPaymentStatus()
    //     console.log('checking for payment status every 5 secs,')
    // });
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use((0, helmet_1.default)());
    app.use((0, morgan_1.default)('dev'));
    app.use((0, cors_1.default)());
    app.use(express_1.default.urlencoded({ extended: false }));
    app.use(http_1.default);
    app.use(routes_1.default);
    app.use(error_handler_1.default);
    app.listen(app_1.default.server.port, () => console.log(constant_1.default.messages.serverUp + app_1.default.server.port));
})).catch(error => console.log(error));
