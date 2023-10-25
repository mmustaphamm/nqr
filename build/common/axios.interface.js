"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.axiosErrorHandler = void 0;
const axios_1 = __importDefault(require("axios"));
/**
 * @see https://github.com/axios/axios/issues/3612
 * @param callback
 * @returns
 */
function axiosErrorHandler(callback) {
    return (error) => {
        if (axios_1.default.isAxiosError(error)) {
            callback({
                error: error,
                type: 'axios-error'
            });
        }
        else {
            callback({
                error: error,
                type: 'stock-error'
            });
        }
    };
}
exports.axiosErrorHandler = axiosErrorHandler;
