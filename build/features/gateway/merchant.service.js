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
exports.MerchantService = void 0;
const BadRequestError_1 = __importDefault(require("../../loader/error-handler/BadRequestError"));
const data_source_1 = require("../../data-source");
const merchant_entity_1 = require("./merchant.entity");
const submerchant_entity_1 = require("./submerchant.entity");
class MerchantService {
    static createMerchant(merchantDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = data_source_1.AppDataSource.getRepository(merchant_entity_1.Merchants);
            const merchant = userRepository.create(merchantDetails);
            if (!merchant)
                throw new Error("merchant could not be created");
            yield userRepository.save(merchant);
            return merchant;
        });
    }
    static createSubMerchant(submerchantDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userRepository = data_source_1.AppDataSource.getRepository(submerchant_entity_1.SubMerchants);
                const submerchant = userRepository.create(submerchantDetails);
                if (!submerchant) {
                    throw new BadRequestError_1.default("Submerchant could not be created");
                }
                yield userRepository.save(submerchant);
                return submerchant;
            }
            catch (error) {
                console.error('Error while creating submerchant:', error);
                throw new BadRequestError_1.default("Failed to create submerchant");
            }
        });
    }
    static getMerchants() {
        return __awaiter(this, void 0, void 0, function* () {
            const merchantRepo = data_source_1.AppDataSource.getRepository(merchant_entity_1.Merchants);
            const merchant = yield merchantRepo.find({});
            return merchant;
        });
    }
    static getMerchantbyAcctNo(account_number) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = data_source_1.AppDataSource.getRepository(merchant_entity_1.Merchants);
            const merchant = yield userRepository.findOne({ where: { AccountNumber: account_number } });
            return merchant;
        });
    }
    static getMerchantByMchNo(mch) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = data_source_1.AppDataSource.getRepository(merchant_entity_1.Merchants);
            const merchant = yield userRepository.findOne({ where: { Mch_no: mch } });
            if (!merchant || merchant == null)
                throw new BadRequestError_1.default("There is no merchant with that mch_no");
            return merchant;
        });
    }
    static getMerchantById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = data_source_1.AppDataSource.getRepository(merchant_entity_1.Merchants);
            const merchant = yield userRepository.findOne({ where: { id } });
            if (!merchant || merchant == null)
                throw new BadRequestError_1.default("There is no merchant with that id");
            return merchant;
        });
    }
    static getMerchantByTin(tin) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = data_source_1.AppDataSource.getRepository(merchant_entity_1.Merchants);
            const merchant = yield userRepository.findOne({ where: { MerchantTIN: tin } });
            return merchant;
        });
    }
    static getSubMerchantbyMchNo(mch_no) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepository = data_source_1.AppDataSource.getRepository(submerchant_entity_1.SubMerchants);
            const merchant = yield userRepository.findOne({ where: { Mch_no: mch_no } });
            return merchant;
        });
    }
}
exports.MerchantService = MerchantService;
