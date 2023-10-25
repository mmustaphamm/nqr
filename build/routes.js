"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const merchant_routes_1 = __importDefault(require("./features/gateway/merchant.routes"));
const router = (0, express_1.Router)();
router.use("/api", merchant_routes_1.default);
exports.default = router;
