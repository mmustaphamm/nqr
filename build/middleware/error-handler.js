"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Exception = void 0;
const ApplicationError_1 = __importDefault(require("../loader/error-handler/ApplicationError"));
const ErrorAlert_1 = __importDefault(require("../loader/monitoring/ErrorAlert"));
const http_response_1 = __importDefault(require("../loader/lib/http-response"));
const error_1 = __importDefault(require("../loader/logging/error"));
const constant_1 = __importDefault(require("../constant"));
const errorHandler = (err, req, res, next) => {
    const errorAlert = new ErrorAlert_1.default(err.message, err.name);
    errorAlert.notify();
    const errorMessage = `${req.ip} : ${req.method} ${req.url} ${err.statusCode} :${err.name} ${err.message} `;
    error_1.default.log({
        message: errorMessage,
        level: "error"
    });
    const { message } = err;
    const body = {
        message: message,
        statusCode: err.statusCode ? err.statusCode : 500,
        data: {},
        success: false
    };
    if (err instanceof ApplicationError_1.default) {
        body.message = constant_1.default.messages.serverError;
        (0, http_response_1.default)(res, body);
    }
    else {
        (0, http_response_1.default)(res, body);
    }
};
exports.Exception = function (statusCode, message, data) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
};
exports.default = errorHandler;
