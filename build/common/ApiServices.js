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
exports.ApiServices = void 0;
const axios_1 = __importDefault(require("axios"));
const kredi_1 = require("../config/kredi");
class ApiServices {
    static getPartner(token, key) {
        return __awaiter(this, void 0, void 0, function* () {
            const http = axios_1.default.create({
                baseURL: ApiServices.walletBaseUrl,
                headers: {
                    Authorization: `Bearer ${token}`,
                    'x-api-key': key
                }
            });
            return yield http.get("api/v2/partner/ids");
        });
    }
    static nqrGateway(payload, url) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IjlHbW55RlBraGMzaE91UjIybXZTdmduTG83WSJ9.eyJhdWQiOiI2Mjc3NDdhYy03YmI0LTQxZDctOGI5OC03NTZmMWQwMjVhMGQiLCJpc3MiOiJodHRwczovL2xvZ2luLm1pY3Jvc29mdG9ubGluZS5jb20vMjc5YzdiMWItYmEwNi00MjdiLWE2ODEtYzhhNTQ5MmQyOTNkL3YyLjAiLCJpYXQiOjE2OTgxNTE2ODgsIm5iZiI6MTY5ODE1MTY4OCwiZXhwIjoxNjk4MTU1NTg4LCJhaW8iOiJBU1FBMi84VUFBQUFHZXcvTjhPQm1OSEtaK1cydVNnR0NNckhwRlNERmVuNUNBcTVONG1QQ2ZzPSIsImF6cCI6IjYyNzc0N2FjLTdiYjQtNDFkNy04Yjk4LTc1NmYxZDAyNWEwZCIsImF6cGFjciI6IjEiLCJyaCI6IjAuQVlJQUczdWNKd2E2ZTBLbWdjaWxTUzBwUGF4SGQySzBlOWRCaTVoMWJ4MENXZzJDQUFBLiIsInRpZCI6IjI3OWM3YjFiLWJhMDYtNDI3Yi1hNjgxLWM4YTU0OTJkMjkzZCIsInV0aSI6IjY0SGExMl9yTjBDdk1CRWNnRG96QUEiLCJ2ZXIiOiIyLjAifQ.JkYNOA36x2bmvxtbf29JavrGFYYToCd4k3EYcx9WuVj7_No4rdUowKjMQjqxN3wtnu1c2sPStV7jSfz6r7KOBMoAIzrCEs9lO7ayok5rcflg26wWZqsmb1s33HgGuGPgVBMomfyN08bP4ENCOhlhxdjOshM2KGz-djQSwlAk_E7ISnClmz1fXSPSMjozgDrDwmOnViAfEAEkLR5_c7iWQqG83Txp1nMQ3DM-YECFBRNec_BP1TV2INT_3uRybt1QVkTQQ883KqlqrzKkpF59v8C0woKzoO7o67HXxxT2kKf1Ela1-kzWNPeKSisOOn-1VRIXZtflwPW9RncT9Eelvw";
                const headers = {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                };
                const response = yield axios_1.default.post(url, payload, { headers });
                return response;
            }
            catch (error) {
                console.log('from catch', (_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.data);
                throw error;
            }
        });
    }
    static sendWebookNotification(url, payload, signatureKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const http = axios_1.default.create({
                headers: {
                    'signature-key': signatureKey
                }
            });
            const response = yield http.post(url, payload);
            return response;
        });
    }
}
exports.ApiServices = ApiServices;
ApiServices.paymentBaseUrl = kredi_1.paymentRail.accounts[kredi_1.paymentRail.account];
ApiServices.walletBaseUrl = kredi_1.baseUrls.userService;
