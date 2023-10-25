"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const response_messages_1 = __importDefault(require("./response/response-messages"));
const http_codes_1 = __importDefault(require("./response/http-codes"));
const error_name_1 = __importDefault(require("./response/error-name"));
const Constant = {
    messages: response_messages_1.default,
    statusCode: http_codes_1.default,
    errorName: error_name_1.default
};
exports.default = Constant;
