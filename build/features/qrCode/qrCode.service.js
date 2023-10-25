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
Object.defineProperty(exports, "__esModule", { value: true });
exports.QRCodeService = void 0;
const data_source_1 = require("../../data-source");
const qrCode_entity_1 = require("./qrCode.entity");
class QRCodeService {
    static getQrcode() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const qRRepository = data_source_1.AppDataSource.getRepository(qrCode_entity_1.GeneratedQRCode);
                const qrcode = yield qRRepository.find({});
                return qrcode;
            }
            catch (error) {
                console.error('Error while fetching QR codes:', error);
                throw new Error("Failed to retrieve QR codes");
            }
        });
    }
    static getSingleQRCode(Order_sn) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const qrRepository = data_source_1.AppDataSource.getRepository(qrCode_entity_1.GeneratedQRCode);
                const qrCode = yield qrRepository.findOne({ where: { Order_sn } });
                if (!qrCode) {
                    throw new Error("The QR code does not exist");
                }
                return qrCode;
            }
            catch (error) {
                console.error('Error while fetching QR Code:', error);
                throw new Error("Failed to retrieve the QR code");
            }
        });
    }
    static getQRCodeByOrderNo(order_no) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const qrRepository = data_source_1.AppDataSource.getRepository(qrCode_entity_1.GeneratedQRCode);
                const qrCode = yield qrRepository.findOne({ where: { order_no } });
                if (!qrCode) {
                    throw new Error("The QR code does not exist");
                }
                return qrCode;
            }
            catch (error) {
                console.error('Error while fetching QR Code:', error);
                throw new Error("Failed to retrieve the QR code");
            }
        });
    }
    static updateQrCode(order_no) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const qrRepository = data_source_1.AppDataSource.getRepository(qrCode_entity_1.GeneratedQRCode);
                const qrCode = yield qrRepository.find({ where: { order_no } });
                if (!qrCode) {
                    return null;
                }
                yield qrRepository.update({ order_no }, { isPaid: true });
                return 'QR Code updated successfully';
            }
            catch (error) {
                console.error('Error updating QR Code:', error);
                return 'Error updating QR Code';
            }
        });
    }
    static createQrCode(qrCodeDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const qrRepository = data_source_1.AppDataSource.getRepository(qrCode_entity_1.GeneratedQRCode);
                const qrCode = qrRepository.create(qrCodeDetails);
                //  const g = new GeneratedQRCode()
                //  g.CodeUrl = qrCodeDetails.CodeUrl
                if (!qrCode) {
                    throw new Error("Qr could not be created");
                }
                yield qrRepository.save(qrCode);
                return qrCode;
            }
            catch (error) {
                console.error('Error while creating QR Code:', error);
                throw new Error("Failed to create QR Code:");
            }
        });
    }
    static getPaymentOrderStatus() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const qrRepository = data_source_1.AppDataSource.getRepository(qrCode_entity_1.GeneratedQRCode);
                const qrRecords = qrRepository
                    .createQueryBuilder('qrcode')
                    .where('qrcode.isPaid = :isPaid', { isPaid: false })
                    .orderBy('qrcode.id', 'ASC')
                    .take(20)
                    .getMany();
                return qrRecords;
            }
            catch (error) {
                console.error('An error occurred:', error);
                throw error;
            }
        });
    }
}
exports.QRCodeService = QRCodeService;
