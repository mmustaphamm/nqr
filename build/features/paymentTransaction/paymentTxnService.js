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
exports.PaymentService = void 0;
const data_source_1 = require("../../data-source");
const paymentTransaction_entity_1 = require("./paymentTransaction.entity");
class PaymentService {
    static createPayment(details) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const paymentRepository = data_source_1.AppDataSource.getRepository(paymentTransaction_entity_1.PaymentTransaction);
                const payment = paymentRepository.create(details);
                if (!payment) {
                    throw new Error("Payment could not be created");
                }
                yield paymentRepository.save(payment);
                return payment;
            }
            catch (error) {
                console.error('Error while creating payment:', error);
                throw new Error("Failed to create payment");
            }
        });
    }
    static getSinglePayment(order_no) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const paymentRepository = data_source_1.AppDataSource.getRepository(paymentTransaction_entity_1.PaymentTransaction);
                const qrCode = yield paymentRepository.findOne({ where: { SessionID: order_no } });
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
}
exports.PaymentService = PaymentService;
