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
Object.defineProperty(exports, "__esModule", { value: true });
const merchant_entity_1 = require("../features/gateway/merchant.entity");
const dotenv = __importStar(require("dotenv"));
const submerchant_entity_1 = require("../features/gateway/submerchant.entity");
const paymentTransaction_entity_1 = require("../features/paymentTransaction/paymentTransaction.entity");
const qrCode_entity_1 = require("../features/qrCode/qrCode.entity");
dotenv.config();
const defaultDB = process.env.DB_CONNECTION;
const connection = {
    mysql: {
        host: process.env.DB_HOST,
        user: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        connectionLimit: Number(process.env.DB_POOL_CONNECTION_LIMIT)
    },
    mongo: {
        url: process.env.MONGO_URL
    },
};
const mapper = {
    typeorm: {
        type: "mysql",
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        synchronize: true,
        logging: false,
        entities: [merchant_entity_1.Merchants, submerchant_entity_1.SubMerchants, paymentTransaction_entity_1.PaymentTransaction, qrCode_entity_1.GeneratedQRCode],
        migrations: [],
        migrationsTableName: "migration_table",
        subscribers: [],
    }
};
const redisOptions = {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD,
    // connectTimeout: 2 // optional
    // tls: {}
};
exports.default = {
    connection,
    defaultDB,
    mapper,
    redisOptions
};
