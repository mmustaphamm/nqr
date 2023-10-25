"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.Utils = void 0;
const axios_1 = __importDefault(require("axios"));
const crypto = __importStar(require("crypto"));
class Utils {
    static EncryptionService(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const apiKey = process.env.SIGN_API_KEY;
                // Convert payload to a sorted, URL-encoded string
                const sortedPayload = Object.entries(payload)
                    .sort(([a], [b]) => a.localeCompare(b))
                    .map(([key, value]) => `${key}=${value}`)
                    .join('&');
                // Combine sortedPayload with the API Key
                const stringToSign = `${sortedPayload}${apiKey}`;
                const md5Hash = crypto.createHash('md5').update(stringToSign).digest('hex');
                const signature = md5Hash.toUpperCase();
                return signature;
            }
            catch (error) {
                console.log("error creating sign", error);
                return "Error creating signature";
            }
        });
    }
    static removePrefix(inputString, prefix) {
        return __awaiter(this, void 0, void 0, function* () {
            if (inputString.startsWith(prefix)) {
                return inputString.slice(prefix.length);
            }
            else {
                return inputString;
            }
        });
    }
    static generateUniqueCode(length) {
        return __awaiter(this, void 0, void 0, function* () {
            const characters = '0123456789';
            let code = '';
            for (let i = 0; i < length; i++) {
                const randomIndex = Math.floor(Math.random() * characters.length);
                code += characters.charAt(randomIndex);
            }
            return code;
        });
    }
    static generateUniqueID() {
        return __awaiter(this, void 0, void 0, function* () {
            // Get the current date (year and month)
            const now = new Date();
            const year = now.getFullYear();
            const month = (now.getMonth() + 1).toString().padStart(2, '0');
            const uniqueCode = yield Utils.generateUniqueCode(24);
            const qrCodeID = `${year}${month}${uniqueCode}`;
            return qrCodeID;
        });
    }
    static generateRandomAlphaNumeric(length) {
        return __awaiter(this, void 0, void 0, function* () {
            if (length < 1 || length > 99) {
                throw new Error('Invalid length. Length must be between 1 and 99.');
            }
            const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            let result = '';
            for (let i = 0; i < length; i++) {
                const randomIndex = Math.floor(Math.random() * characters.length);
                result += characters.charAt(randomIndex);
            }
            return result;
        });
    }
    static FirstDigitInRange(amount) {
        return __awaiter(this, void 0, void 0, function* () {
            const min = 1;
            const max = 99;
            return Math.min(max, Math.max(min, amount));
        });
    }
    static resetRoute() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = {
                    client_id: '627747ac-7bb4-41d7-8b98-756f1d025a0d',
                    scope: '627747ac-7bb4-41d7-8b98-756f1d025a0d/.default',
                    client_secret: 'uAs8Q~gk9Bgok_fXPeTqwqsJf93Dka7YRdNlFbbK',
                    grant_type: 'client_credentials',
                };
                const apiUrl = "https://apitest.nibss-plc.com.ng/v2/reset";
                const formData = new URLSearchParams();
                for (const key in data) {
                    formData.append(key, data[key]);
                }
                const response = yield axios_1.default.post(apiUrl, formData, {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'apiKey': 'LWZzkO2T4UbfRNT06BG0BqaQpdm1RwQs',
                    },
                });
                console.log(response.data);
                return response.data;
            }
            catch (error) {
                throw new Error(`Failed to send POST request: ${error.message}`);
            }
        });
    }
}
exports.Utils = Utils;
