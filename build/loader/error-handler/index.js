"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ApplicationError_1 = __importDefault(require("./ApplicationError"));
const BadRequestError_1 = __importDefault(require("./BadRequestError"));
const NotAuthorizeError_1 = __importDefault(require("./NotAuthorizeError"));
const ForbiddenError_1 = __importDefault(require("./ForbiddenError"));
const NotFoundError_1 = __importDefault(require("./NotFoundError"));
const errors = {
    NotFoundError: NotFoundError_1.default,
    ApplicationError: ApplicationError_1.default,
    BadRequestError: BadRequestError_1.default,
    ForbiddenError: ForbiddenError_1.default,
    NotAuthorizeError: NotAuthorizeError_1.default
};
exports.default = errors;
