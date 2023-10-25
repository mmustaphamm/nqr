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
const BadRequestError_1 = __importDefault(require("../loader/error-handler/BadRequestError"));
const NotAuthorizeError_1 = __importDefault(require("../loader/error-handler/NotAuthorizeError"));
const ApiServices_1 = require("../common/ApiServices");
const crypto_1 = require("crypto");
const ForbiddenError_1 = __importDefault(require("../loader/error-handler/ForbiddenError"));
const app_1 = __importDefault(require("../config/app"));
const signatureVerification = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    //const partner = res.locals.partner
    const signatureKey = req.headers['signature-key'];
    //const { mch, timestamp } = req.body
    if (!signatureKey) {
        return next(new NotAuthorizeError_1.default('Unauthorized attempt! provide your signature'));
    }
    // compute signature
    const sortedPayload = Object.entries(req.body)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, value]) => `${key}=${value}`)
        .join('&');
    const mac = (0, crypto_1.createHash)('md5').update(`${sortedPayload}`).digest('hex');
    // terminate if signature does not match
    if (mac !== signatureKey) {
        console.log(mac);
        return next(new ForbiddenError_1.default('Forbidden! unauthenticated'));
    }
    return;
});
const validateToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // console.log(redis)
    try {
        const { authorization } = req.headers;
        const apiKey = req.headers['x-api-key'];
        if ((authorization === undefined || authorization === "") || (apiKey === undefined || apiKey === "")) {
            return next(new BadRequestError_1.default("Provide authentication credentials"));
        }
        let bearer = "";
        let token = "";
        [bearer, token] = authorization.split(" ");
        if (bearer !== "Bearer") {
            res.set("WWW-Authenticate", "Bearer realm= Access Token, charset=UTF-8");
            return next(new NotAuthorizeError_1.default("Bad Request  :Invalid Authorization"));
        }
        // get from cache
        const cacheData = false; //await cache.get(`${token}${apiKey}`)
        let partner = cacheData; //: merchantData = cacheData
        if (!cacheData) {
            // call the Auth service
            const apiData = yield ApiServices_1.ApiServices.getPartner(token, `${apiKey}`);
            partner = (_a = apiData === null || apiData === void 0 ? void 0 : apiData.data) === null || _a === void 0 ? void 0 : _a.data;
            if (partner.id && (partner === null || partner === void 0 ? void 0 : partner.glId)) {
                //await cache.set(`${token}${apiKey}`, partner)
            }
            else {
                console.log(apiData);
                return next(new BadRequestError_1.default("Merchant profile is not complete"));
            }
        }
        console.log("merchant authenticated");
        res.locals.partner = partner || null;
        let webhook;
        // don't require signature on the local env
        if (app_1.default.server.env !== 'local') {
            webhook = yield signatureVerification(req, res, next);
        }
        else {
            // webhook = await WebhookService.getWebhookByPartner(partner.id, 'outward')
            // if (!webhook) return next(new NotAuthorizeError('provide your secret key'))
        }
        next();
    }
    catch (error) {
        return next(new BadRequestError_1.default(error));
    }
});
exports.default = validateToken;
