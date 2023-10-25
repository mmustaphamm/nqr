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
exports.dynamicqrValidator = exports.createSubMerchValidator = exports.createMerchValidator = void 0;
const joi_1 = __importDefault(require("joi"));
const BadRequestError_1 = __importDefault(require("../loader/error-handler/BadRequestError"));
const createMerchValidator = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { name, tin, contact, phone, email, address, account_name, account_number } = req.body;
        const Schema = joi_1.default.object({
            address: joi_1.default.string().required(),
            phone: joi_1.default.string().required(),
            contact: joi_1.default.string().required(),
            account_number: joi_1.default.string().length(10).required(),
            account_name: joi_1.default.string().required(),
            tin: joi_1.default.string().min(8).max(15).required(),
            email: joi_1.default.string().email().required(),
            name: joi_1.default.string().required()
        });
        yield Schema.validateAsync({
            name,
            contact,
            tin,
            account_name,
            account_number,
            email,
            address,
            phone
        });
        next();
    }
    catch (error) {
        return next(new BadRequestError_1.default(error.message));
    }
});
exports.createMerchValidator = createMerchValidator;
const createSubMerchValidator = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { name, email, mch_no, sub_amount, sub_fixed, phone_number, } = req.body;
        const Schema = joi_1.default.object({
            phone_number: joi_1.default.string().required(),
            email: joi_1.default.string().email().required(),
            mch_no: joi_1.default.string().required(),
            name: joi_1.default.string().required(),
            sub_amount: joi_1.default.string().required(),
            sub_fixed: joi_1.default.string()
        });
        yield Schema.validateAsync({
            name,
            email,
            mch_no,
            sub_amount,
            sub_fixed,
            phone_number
        });
        next();
    }
    catch (error) {
        return next(new BadRequestError_1.default(error.message));
    }
});
exports.createSubMerchValidator = createSubMerchValidator;
const dynamicqrValidator = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { mch_no, amount, sub_mch_no, } = req.body;
        const Schema = joi_1.default.object({
            mch_no: joi_1.default.string().required(),
            sub_mch_no: joi_1.default.string().required(),
            amount: joi_1.default.string().required(),
        });
        yield Schema.validateAsync({
            mch_no,
            amount,
            sub_mch_no,
        });
        next();
    }
    catch (error) {
        return next(new BadRequestError_1.default(error.message));
    }
});
exports.dynamicqrValidator = dynamicqrValidator;
