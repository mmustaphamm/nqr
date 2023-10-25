"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const path_1 = __importDefault(require("path"));
const infoFile = path_1.default.join("./", "/logs/http.log");
const streamLogger = winston_1.default.createLogger({
    transports: [
        new winston_1.default.transports.File({
            filename: infoFile,
            level: "info"
        })
    ]
});
const stream = {
    write: (message) => streamLogger.info(message)
};
exports.default = stream;
