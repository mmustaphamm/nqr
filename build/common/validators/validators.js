"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fixedqrValidator = exports.createSubMerchantValidator = void 0;
const joi_1 = __importDefault(require("joi"));
const createSubMerchantValidator = (details) => {
    const schema = joi_1.default.object({
        name: joi_1.default.string().required(),
        email: joi_1.default.string().email().required(),
        phone_number: joi_1.default.string().required(),
        mch_no: joi_1.default.string().required(),
        sub_amount: joi_1.default.string().required(),
        sub_fixed: joi_1.default.string().required(),
    });
    const options = {
        errors: {
            wrap: {
                label: "",
            },
        },
    };
    return schema.validate(details, options);
};
exports.createSubMerchantValidator = createSubMerchantValidator;
const fixedqrValidator = (details) => {
    const schema = joi_1.default.object({
        mch_no: joi_1.default.string().required(),
        sub_mch_no: joi_1.default.string().required(),
        amount: joi_1.default.string().required(),
        user_kyc_level: joi_1.default.string().required(),
        user_account_number: joi_1.default.string().max(10).required(),
        user_account_name: joi_1.default.string().required(),
        user_bank_verification_number: joi_1.default.string().required(),
        order_no: joi_1.default.string().required(),
    });
    const options = {
        errors: {
            wrap: {
                label: "",
            },
        },
    };
    return schema.validate(details, options);
};
exports.fixedqrValidator = fixedqrValidator;
