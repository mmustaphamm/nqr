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
exports.MerchantController = void 0;
const merchant_service_1 = require("./merchant.service");
const Utils_1 = require("../../common/Utils");
const ApiServices_1 = require("../../common/ApiServices");
const qrCode_service_1 = require("../qrCode/qrCode.service");
const paymentTxnService_1 = require("../paymentTransaction/paymentTxnService");
const crypto_1 = require("crypto");
class MerchantController {
    static queryAcct(account_number) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const channel = process.env.CHANNEL_NO;
                const institution_number = process.env.INSTITUTION_NUMBER;
                const bank_number = process.env.BANK_NUMBER;
                const url = process.env.QUERY_ACCT_URL;
                const timestamp = String(Math.floor(Date.now() / 1000));
                const sign = yield Utils_1.Utils.EncryptionService({
                    institution_number,
                    channel,
                    bank_number,
                    account_number,
                    timestamp
                });
                const payload = {
                    institution_number,
                    channel,
                    bank_number,
                    account_number,
                    timestamp,
                    sign
                };
                const result = yield ApiServices_1.ApiServices.nqrGateway(payload, url);
                console.log(result.status);
                return result;
            }
            catch (error) {
                console.log(`Error querying account ${error}`);
                throw error;
            }
        });
    }
    static createMerchant(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("creating merchant");
                const institution_number = process.env.INSTITUTION_NUMBER;
                const bank_no = process.env.BANK_NUMBER;
                const { account_number, name, tin, contact, address, phone, email, m_fee_bearer, account_name, } = req.body;
                MerchantController.queryAcct(account_number).then((result) => __awaiter(this, void 0, void 0, function* () {
                    if (result && result.data.ReturnCode == "Fail") {
                        res.status(400).json({ data: result.data });
                    }
                    else if (result && result.data.ReturnCode == "Success") {
                        const { AccountNumber, AccountName, BankVerificationNumber, KYCLevel } = result.data;
                        //         await Promise.all([
                        //     MerchantService.getMerchantbyAcctNo(AccountNumber),
                        //     MerchantService.getMerchantByTin(tin),  
                        // ]).then(([existingAccount, existingTin]) => {
                        //     if (existingAccount) throw new BadRequestError("Account number already in use");
                        //     if (existingTin) throw new BadRequestError("A merchant exists with that tin");
                        // });
                        const timestamp = String(Math.floor(Date.now() / 1000));
                        const sign = yield Utils_1.Utils.EncryptionService({
                            institution_number,
                            tin,
                            email,
                            address,
                            phone,
                            contact,
                            name,
                            bank_no,
                            account_name,
                            m_fee_bearer,
                            account_number,
                            timestamp
                        });
                        if (sign) {
                            const payload1 = {
                                institution_number,
                                name,
                                tin,
                                contact,
                                phone,
                                email,
                                address,
                                bank_no,
                                account_name,
                                account_number,
                                m_fee_bearer,
                                timestamp,
                                sign
                            };
                            const url = process.env.CREATE_MERCHANT_URL;
                            ApiServices_1.ApiServices.nqrGateway(payload1, url).then((result) => __awaiter(this, void 0, void 0, function* () {
                                if (result && result.data.ReturnCode == "Fail") {
                                    res.json(400).json({ data: result.data });
                                }
                                else if (result && result.data.ReturnCode == "Success") {
                                    const { Mch_no } = result.data;
                                    MerchantController.bindMerchantAcct({
                                        mch_no: Mch_no,
                                        account_name,
                                        account_number
                                    }).then(res => {
                                        // await MerchantService.createMerchant({...createMerchant, 
                                        //  AccountNumber, 
                                        //  AccountName, 
                                        //   BankVerificationNumber, 
                                        //  KYCLevel, 
                                        //  m_fee_bearer
                                        // })
                                        console.log("merchant created and binded");
                                    });
                                    res.status(200).json({ success: true, data: result.data });
                                }
                                else {
                                    res.status(500).json({ data: result.data });
                                }
                            }));
                        }
                    }
                    else {
                        res.status(500).json({ data: result.data });
                    }
                }));
                // if (result && result.data.ReturnCode == "Fail") {
                //     res.status(400).json({data: result.data})
                // } else if (result && result.data.ReturnCode == "Success"){
                //     res.status(200).json({data: result.data})
                // } else {
                //     return
                // }
                // const { AccountNumber, AccountName, BankVerificationNumber, KYCLevel } = result;
                // await Promise.all([
                //     MerchantService.getMerchantbyAcctNo(AccountNumber),
                //     MerchantService.getMerchantByTin(tin),
                //     MerchantService.getMerchantByEmail(email)
                // ]).then(([existingAccount, existingTin, existingEmail]) => {
                //     if (existingAccount) throw new BadRequestError("Account number already in use");
                //     if (existingTin) throw new BadRequestError("A merchant exists with that tin");
                //     if (existingEmail) throw new BadRequestError("A merchant exists with that email");
                // });
                // const timestamp = String(Math.floor(Date.now() / 1000));
                // const sign = await Utils.EncryptionService({
                //     institution_number,
                //     tin, 
                //     email, 
                //     address, 
                //     phone, 
                //     contact, 
                //     name, 
                //     bank_no, 
                //     account_name, 
                //     m_fee_bearer, 
                //     account_number, 
                //     timestamp
                // })
                // const payload1:CreateMerchantPayload = {
                //     institution_number,
                //     name,
                //     tin,
                //     contact,
                //     phone,
                //     email,
                //     address,
                //     bank_no,
                //     account_name,
                //     account_number,
                //     m_fee_bearer,
                //     timestamp,
                //     sign
                // }
                // const url = process.env.CREATE_MERCHANT_URL as string;
                //    const createMerchant = await ApiServices.nqrGateway(payload1, url);
                //  const { Mch_no } = createMerchant;
                // const bindAcct = await MerchantController.bindMerchantAcct({ 
                //     mch_no:Mch_no, 
                //     account_name,
                //     account_number
                // });
                // await MerchantService.createMerchant({...createMerchant, AccountNumber, AccountName, BankVerificationNumber, KYCLevel, m_fee_bearer})
                // res.status(200).json({ success: true, message: result});
            }
            catch (error) {
                res.status(500).send(`Internal server error :${error}`);
            }
        });
    }
    static bindMerchantAcct(bindDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const institution_number = process.env.INSTITUTION_NUMBER;
                const bank_no = process.env.BANK_NUMBER;
                const { account_name, account_number, mch_no } = bindDetails;
                const timestamp = String(Math.floor(Date.now() / 1000));
                const sign = yield Utils_1.Utils.EncryptionService({
                    institution_number,
                    mch_no, bank_no,
                    account_name,
                    account_number,
                    timestamp
                });
                const payload = {
                    institution_number,
                    mch_no,
                    bank_no,
                    account_name,
                    account_number,
                    timestamp,
                    sign
                };
                const url = process.env.BIND_MERCH_URL;
                const result = yield ApiServices_1.ApiServices.nqrGateway(payload, url);
                return result;
            }
            catch (error) {
                console.log(`Error binding account ${error}`);
                throw error;
            }
        });
    }
    static createSubMerchant(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const institution_number = process.env.INSTITUTION_NUMBER;
                const url = process.env.CREATE_SUBMERCH_URL;
                const { name, phone_number, email, sub_amount, sub_fixed, mch_no } = req.body;
                //subfixed:This is an integer value used to denote if the QR code is a Fixed-Custom QR code or a Fixed-Defined QR code. “0” - Fixed-Custom QR code “1” - Fixed-Defined QR code
                const timestamp = String(Math.floor(Date.now() / 1000));
                const sign = yield Utils_1.Utils.EncryptionService({
                    institution_number,
                    name,
                    email,
                    phone_number,
                    sub_fixed,
                    mch_no,
                    sub_amount,
                    timestamp
                });
                const payload = {
                    institution_number,
                    name,
                    mch_no,
                    phone_number,
                    email,
                    sub_fixed,
                    sub_amount,
                    timestamp,
                    sign
                };
                ApiServices_1.ApiServices.nqrGateway(payload, url).then((result) => __awaiter(this, void 0, void 0, function* () {
                    if (result && result.data.ReturnCode == "Fail") {
                        res.status(400).json({ success: false, data: result.data });
                    }
                    else if (result && result.data.ReturnCode == "Success") {
                        const { Institution_number, Mch_no, Sub_name, Sub_mch_no, Emvco_code } = result.data;
                        yield merchant_service_1.MerchantService.createSubMerchant({
                            Institution_number,
                            Mch_no,
                            Sub_mch_no,
                            Sub_name,
                            Emvco_code,
                            email
                        });
                        res.status(200).json({ success: true, data: result.data });
                    }
                    else {
                        res.status(500).json({ success: false, data: result.data });
                    }
                }));
            }
            catch (error) {
                console.log(error);
                res.status(500).send(`Internal server error :${error}`);
            }
        });
    }
    static getMerchTxnRecord(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const institution_number = process.env.INSTITUTION_NUMBER;
                const url = process.env.MERCHANT_TXN_URL;
                const order_type = process.env.ORDER_TYPE;
                const { sub_mch_no, start_time, page, end_time, mch_no } = req.body;
                const timestamp = String(Math.floor(Date.now() / 1000));
                const sign = yield Utils_1.Utils.EncryptionService({
                    institution_number,
                    mch_no,
                    sub_mch_no,
                    start_time,
                    end_time,
                    page,
                    order_type,
                    timestamp
                });
                if (sign) {
                    const payload = {
                        institution_number,
                        mch_no,
                        sub_mch_no,
                        end_time,
                        start_time,
                        page,
                        order_type,
                        sign,
                        timestamp,
                    };
                    ApiServices_1.ApiServices.nqrGateway(payload, url).then((result) => __awaiter(this, void 0, void 0, function* () {
                        if (result && result.data.ReturnCode == "Fail") {
                            res.status(400).json({ data: result.data });
                        }
                        else if (result && result.data.ReturnCode == "Success") {
                            res.status(200).json({ data: result.data });
                        }
                        else {
                            res.status(500).json({ data: result.data });
                        }
                    }));
                }
            }
            catch (error) {
                console.log(`Error getting merchant transaction ${error}`);
                res.status(500).send(`Internal Server Error :${error}`);
            }
        });
    }
    static createMerchInBatch(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const institution_number = process.env.INSTITUTION_NUMBER;
                const url = process.env.CREATE_BATCH_MERCHANT_URL;
                const batchMerchants = req.body.list;
                // const invalidAccounts:BatchMerchant [] = [];
                // const validAccounts:BatchMerchant [] = []
                // for (const merchant of batchMerchants) {
                //     // await Promise.all([
                //     //    // MerchantService.getMerchantbyAcctNo( merchant.account_number),
                //     //     MerchantService.getMerchantByTin(merchant.tin),
                //     //     MerchantService.getMerchantByEmail(merchant.email)
                //     // ]).then(([ existingAccount, existingTin, existingEmail]) => {
                //     //     if (existingAccount) throw new Error("A merchant exists with that account number");
                //     //     if (existingTin) throw new Error("A merchant exists with that tin");
                //     //     if (existingEmail) throw new Error("A merchant exists with that email");
                //     // });
                //     MerchantController.queryAcct(merchant.account_number).then( resp => {
                //         if (resp && resp.data.ReturnCode == "Fail") {
                //             console.log("This is an invalid account number:", merchant.account_number)
                //             invalidAccounts.push(merchant)
                //         } else if (resp && resp.data.ReturnCode == "Success") {
                //             console.log("This is an valid account number:", merchant.account_number)
                //             validAccounts.push(merchant)
                //         }  else {
                //             return
                //         }  
                //     })
                //  }
                const timestamp = String(Math.floor(Date.now() / 1000));
                const sign = yield Utils_1.Utils.EncryptionService({ institution_number, timestamp });
                const payload = {
                    institution_number,
                    sign,
                    timestamp,
                    list: batchMerchants
                };
                ApiServices_1.ApiServices.nqrGateway(payload, url).then((result) => __awaiter(this, void 0, void 0, function* () {
                    if (result && result.data.ReturnCode == "Fail") {
                        res.status(400).json({ data: result.data });
                    }
                    else if (result && result.data.ReturnCode == "Success") {
                        console.log('start');
                        const { List } = result.data;
                        const bindAccount = List.map((item) => __awaiter(this, void 0, void 0, function* () {
                            const { Mch_no, Name, M_tin } = item;
                            const searchBatch = batchMerchants.filter((item) => item.name === Name && item.tin === M_tin);
                            console.log('middle');
                            if (searchBatch.length > 0) {
                                console.log('Matching merchant found:', searchBatch);
                                console.log('end');
                                const { account_name, account_number } = searchBatch[0];
                                MerchantController.bindMerchantAcct({
                                    mch_no: Mch_no,
                                    account_name,
                                    account_number
                                }).then(res => {
                                    if (res && res.data)
                                        console.log("merchnt binded");
                                });
                            }
                        }));
                        yield Promise.all(bindAccount);
                        res.status(200).json({ success: true, data: result.data });
                    }
                    else {
                        res.status(500).json({ data: result.data });
                    }
                }));
                // const { List } = result.data
                // const bindAccount = List.map(async (item) => {
                //     const { Mch_no, Name, M_tin } = item;
                //     const searchBatch = validAccounts.filter((item) => item.name === Name && item.tin === M_tin)
                //     if (searchBatch.length > 0) {
                //         console.log('Matching merchant found:', searchBatch);
                //         const { account_name, account_number} = searchBatch[0]
                //         const bindAcct = await MerchantController.bindMerchantAcct({ 
                //             mch_no:Mch_no, 
                //             account_name, 
                //             account_number
                //         })
                //     }
                //   });
                //   await Promise.all(bindAccount);
            }
            catch (error) {
                console.log(`Error creating batch merchant `, error);
                res.status(500).send(`Internal Server Error :${error}`);
            }
        });
    }
    static createSubMerchInBatch(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const institution_number = process.env.INSTITUTION_NUMBER;
                const url = process.env.CREATE_BATCH_SUBMERCHANT_URL;
                const { mch_no } = req.body;
                const subBatchMerchants = req.body.list;
                const timestamp = String(Math.floor(Date.now() / 1000));
                const sign = yield Utils_1.Utils.EncryptionService({ institution_number, mch_no, timestamp });
                const payload = {
                    institution_number,
                    mch_no,
                    timestamp,
                    sign,
                    list: subBatchMerchants
                };
                ApiServices_1.ApiServices.nqrGateway(payload, url).then((result) => __awaiter(this, void 0, void 0, function* () {
                    if (result && result.data.ReturnCode == "Fail") {
                        res.json(400).json({ data: result.data });
                    }
                    else if (result && result.data.ReturnCode == "Success") {
                        const { Mch_no } = result.data;
                        const { List } = result.data;
                        const saveSubMerch = List.map((item) => __awaiter(this, void 0, void 0, function* () {
                            const { Sub_name, Sub_mch_no, Emvco_code } = item;
                            yield merchant_service_1.MerchantService.createSubMerchant({
                                Institution_number: institution_number,
                                Mch_no: Mch_no,
                                Sub_name,
                                Sub_mch_no,
                                Emvco_code
                            });
                        }));
                        yield Promise.all(saveSubMerch);
                        res.status(200).json({ data: result.data });
                    }
                    else {
                        res.status(500).json({ data: result.data });
                    }
                }));
            }
            catch (error) {
                console.log(`Error creating batch submerchant ${error}`);
                res.status(500).send(`Internal Server Error :${error}`);
            }
        });
    }
    static createDynamicQrCode(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const url = process.env.CREATE_DYNAMICQR_URL;
                const { mch_no, sub_mch_no, amount } = req.body;
                const firstDigit = yield Utils_1.Utils.FirstDigitInRange(amount);
                const unique_id = yield Utils_1.Utils.generateRandomAlphaNumeric(firstDigit);
                const channel = process.env.CHANNEL_NO;
                const institution_number = process.env.INSTITUTION_NUMBER;
                const order_type = process.env.ORDER_TYPE;
                const code_type = process.env.CODE_TYPE;
                const order_no = yield Utils_1.Utils.generateUniqueID();
                const timestamp = String(Math.floor(Date.now() / 1000));
                const sign = yield Utils_1.Utils.EncryptionService({
                    institution_number,
                    amount,
                    channel,
                    code_type,
                    order_no,
                    sub_mch_no,
                    order_type,
                    unique_id,
                    mch_no,
                    timestamp
                });
                if (sign) {
                    const payload = {
                        channel,
                        institution_number,
                        mch_no,
                        sub_mch_no,
                        code_type,
                        amount,
                        order_no,
                        order_type,
                        unique_id,
                        timestamp,
                        sign
                    };
                    ApiServices_1.ApiServices.nqrGateway(payload, url).then((result) => __awaiter(this, void 0, void 0, function* () {
                        if (result && result.data.ReturnCode == " Fail") {
                            res.status(400).json({ data: result.data });
                        }
                        else if (result && result.data.ReturnCode == "Success") {
                            const { OrderSn, CodeUrl } = result.data;
                            merchant_service_1.MerchantService.getMerchantByMchNo(mch_no).then(merch => {
                                qrCode_service_1.QRCodeService.createQrCode({ Order_sn: OrderSn, CodeUrl, mch_no, order_no, mch_ID: merch.id })
                                    .then(res => {
                                    console.log("qr code created");
                                });
                            });
                            res.status(200).json({ success: true, data: result.data });
                        }
                        else {
                            res.status(400).json({ data: result.data });
                        }
                    }));
                }
            }
            catch (error) {
                console.log(`Error creating dynamic qr code ${error}`);
                res.status(500).send(`Internal Server Error :${error}`);
            }
        });
    }
    static createFixedQrCode(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const institution_number = process.env.INSTITUTION_NUMBER;
                const url = process.env.CREATE_SUBMERCH_URL;
                const { name, phone_number, email, sub_amount, sub_fixed, mch_no } = req.body;
                //subfixed:This is an integer value used to denote if the QR code is a Fixed-Custom QR code or a Fixed-Defined QR code. “0” - Fixed-Custom QR code “1” - Fixed-Defined QR code
                const timestamp = String(Math.floor(Date.now() / 1000));
                const sign = yield Utils_1.Utils.EncryptionService({
                    institution_number,
                    name,
                    email,
                    phone_number,
                    sub_fixed,
                    mch_no,
                    sub_amount,
                    timestamp
                });
                if (sign) {
                    const payload = {
                        institution_number,
                        name,
                        mch_no,
                        phone_number,
                        email,
                        sub_fixed,
                        sub_amount,
                        timestamp,
                        sign
                    };
                    ApiServices_1.ApiServices.nqrGateway(payload, url).then((result) => __awaiter(this, void 0, void 0, function* () {
                        if (result && result.data.ReturnCode == "Fail") {
                            res.status(400).json({ success: false, data: result.data });
                        }
                        else if (result && result.data.ReturnCode == "Success") {
                            // const { Institution_number, Mch_no, Sub_name, Sub_mch_no, Emvco_code } = result.data
                            // await MerchantService.createSubMerchant({
                            //     Institution_number, 
                            //     Mch_no, 
                            //     Sub_mch_no, 
                            //     Sub_name, 
                            //     Emvco_code, 
                            //     email
                            //     })
                            res.status(200).json({ success: true, data: result.data });
                        }
                        else {
                            res.status(500).json({ success: false, data: result.data });
                        }
                    }));
                }
            }
            catch (error) {
                console.log(error);
                res.status(500).send(`Internal server error :${error}`);
            }
        });
    }
    static cancelDynamicQrCode(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { order_sn } = req.body;
                const institution_number = process.env.INSTITUTION_NUMBER;
                const url = process.env.CANCEL_DYNAMICQR_URL;
                const timestamp = String(Math.floor(Date.now() / 1000));
                const sign = yield Utils_1.Utils.EncryptionService({ institution_number, order_sn, timestamp });
                if (sign) {
                    const payload = {
                        institution_number,
                        order_sn,
                        timestamp,
                        sign
                    };
                    ApiServices_1.ApiServices.nqrGateway(payload, url).then((result) => __awaiter(this, void 0, void 0, function* () {
                        if (result && result.data.ReturnCode == "Fail") {
                            res.status(400).json({ data: result.data });
                        }
                        else if (result && result.data.ReturnCode == "Success") {
                            // await QRCodeService.updateQrCode(order_sn)
                            // .then(res => {
                            //     console.log("qr code created")
                            // })
                            res.status(200).json({ success: true, data: result.data });
                        }
                        else {
                            res.status(400).json({ data: result.data });
                        }
                    }));
                }
            }
            catch (error) {
                console.log(`Error canceling qr code ${error}`);
                res.status(500).send(`Internal Server Error :${error}`);
            }
        });
    }
    static queryPaymentStatus() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('Checking for payment status');
                const orders = yield qrCode_service_1.QRCodeService.getPaymentOrderStatus();
                const institution_number = process.env.INSTITUTION_NUMBER;
                const url = process.env.QUERY_ORDER_STATUS_URL;
                const results = [];
                for (let order of orders) {
                    const { order_no } = order;
                    const timestamp = String(Math.floor(Date.now() / 1000));
                    const sign = yield Utils_1.Utils.EncryptionService({ institution_number, order_no, timestamp });
                    if (sign) {
                        const payload = {
                            institution_number,
                            order_no,
                            timestamp,
                            sign,
                        };
                        ApiServices_1.ApiServices.nqrGateway(payload, url).then((result) => __awaiter(this, void 0, void 0, function* () {
                            if (result && result.data.ReturnCode == "Fail") {
                                return;
                            }
                            else if (result && result.data.ReturnCode == "Success") {
                                qrCode_service_1.QRCodeService.updateQrCode(order_no).then(resp => {
                                    results.push(result.data);
                                    console.log("updated");
                                });
                                console.log(results);
                                return results;
                            }
                            else {
                                return;
                            }
                        }));
                    }
                }
                return results;
            }
            catch (error) {
                console.log(`Error querying payment status: ${error}`);
                //res.status(500).send(`Internal Server Error: ${error}`);
                throw error;
            }
        });
    }
    static queryMerchantStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { qr_cate, sub_no } = req.body;
                const institution_number = process.env.INSTITUTION_NUMBER;
                const url = process.env.QUERY_MERCHANT_STATUS_URL;
                const timestamp = String(Math.floor(Date.now() / 1000));
                const sign = yield Utils_1.Utils.EncryptionService({ institution_number,
                    qr_cate,
                    sub_no,
                    timestamp
                });
                if (sign) {
                    const payload = {
                        institution_number,
                        qr_cate,
                        sub_no,
                        timestamp,
                        sign
                    };
                    ApiServices_1.ApiServices.nqrGateway(payload, url).then((result) => __awaiter(this, void 0, void 0, function* () {
                        if (result && result.data.ReturnCode == " Fail") {
                            res.status(400).json({ data: result.data });
                        }
                        else if (result && result.data.ReturnCode == "Success") {
                            res.status(200).json({ success: true, data: result.data });
                        }
                        else {
                            res.status(500).json({ data: result.data });
                        }
                    }));
                }
            }
            catch (error) {
                console.log(`Error querying merchant status ${error}`);
                res.status(500).send(`Internal Server Error :${error}`);
            }
        });
    }
    static queryTransactionFee(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { mch_no, sub_mch_no, amount } = req.body;
                const institution_number = process.env.INSTITUTION_NUMBER;
                const url = process.env.TRANSACTION_FEE_URL;
                const user_bank_no = process.env.BANK_NUMBER;
                const timestamp = String(Math.floor(Date.now() / 1000));
                const sign = yield Utils_1.Utils.EncryptionService({
                    institution_number,
                    mch_no,
                    sub_mch_no,
                    user_bank_no,
                    amount,
                    timestamp
                });
                if (sign) {
                    const payload = {
                        institution_number,
                        mch_no,
                        sub_mch_no,
                        user_bank_no,
                        amount,
                        timestamp,
                        sign
                    };
                    ApiServices_1.ApiServices.nqrGateway(payload, url).then((result) => __awaiter(this, void 0, void 0, function* () {
                        if (result && result.data.ReturnCode == "Fail") {
                            res.json(400).json({ data: result.data });
                        }
                        else if (result && result.data.ReturnCode == "Success") {
                            res.status(200).json({ success: true, data: result.data });
                        }
                        else {
                            res.status(400).json({ data: result.data });
                        }
                    }));
                }
            }
            catch (error) {
                console.log(`Error querying merchant status ${error}`);
                res.status(500).send(`Internal Server Error :${error}`);
            }
        });
    }
    static createTransactionDynamicQrCode(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user_bank_no = process.env.BANK_NUMBER;
                const user_gps = "";
                const { user_kyc_level, user_account_name, user_account_number, order_sn, order_amount, user_bank_verification_number } = req.body;
                const institution_number = process.env.INSTITUTION_NUMBER;
                const url = process.env.CREATE_TXN_DYNAMICQR_URL;
                const timestamp = String(Math.floor(Date.now() / 1000));
                const sign = yield Utils_1.Utils.EncryptionService({
                    institution_number,
                    user_account_name,
                    user_account_number,
                    order_amount,
                    order_sn,
                    user_bank_no,
                    user_bank_verification_number,
                    user_gps,
                    user_kyc_level,
                    timestamp
                });
                if (sign) {
                    const payload = {
                        institution_number,
                        order_sn,
                        order_amount,
                        user_bank_no,
                        user_account_name,
                        user_account_number,
                        user_bank_verification_number,
                        user_kyc_level,
                        user_gps,
                        timestamp,
                        sign
                    };
                    ApiServices_1.ApiServices.nqrGateway(payload, url).then((result) => __awaiter(this, void 0, void 0, function* () {
                        if (result && result.data.ReturnCode == " Fail") {
                            res.status(400).json({ data: result.data });
                        }
                        else if (result && result.data.ReturnCode == "Success") {
                            yield paymentTxnService_1.PaymentService.createPayment({
                                SessionID: result.data.SessionID,
                                NameEnquiryRef: result.data.NameEnquiryRef,
                                DestinationInstitutionCode: result.data.DestinationInstitutionCode,
                                ChannelCode: result.data.ChannelCode,
                                BeneficiaryAccountName: result.data.BeneficiaryAccountName,
                                BeneficiaryAccountNumber: result.data.BeneficiaryAccountNumber,
                                BeneficiaryKYCLevel: result.data.BeneficiaryKYCLevel,
                                BeneficiaryBankVerificationNumber: result.data.BeneficiaryBankVerificationNumber,
                                OriginatorAccountName: result.data.OriginatorAccountName,
                                OriginatorAccountNumber: result.data.OriginatorAccountNumber,
                                OriginatorBankVerificationNumber: result.data.OriginatorBankVerificationNumber,
                                OriginatorKYCLevel: result.data.data.OriginatorKYCLevel,
                                TransactionLocation: result.data.TransactionLocation,
                                Narration: result.Narration,
                                PaymentReference: result.data.PaymentReference,
                                Amount: result.data.Amount
                            });
                            res.status(200).json({ success: true, data: result.data });
                        }
                        else {
                            res.status(500).json({ data: result.data });
                        }
                    }));
                }
            }
            catch (error) {
                console.log(`Error querying merchant status ${error}`);
                res.status(500).send(`Internal Server Error :${error}`);
            }
        });
    }
    static createTransactionFixedQrCode(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("transaction for fixed qr code");
                // const { error, value } = fixedqrValidator(req.body)
                // if (error) throw new Exception(400, `${error.details[0].message}`)
                const user_bank_no = process.env.BANK_NUMBER;
                const user_gps = "";
                const channel = process.env.CHANNEL_NO;
                const { mch_no, sub_mch_no, user_kyc_level, user_account_name, user_account_number, amount, user_bank_verification_number } = req.body;
                const institution_number = process.env.INSTITUTION_NUMBER;
                const url = process.env.CREATE_TXN_FIXEDQR_URL;
                const timestamp = String(Math.floor(Date.now() / 1000));
                const order_no = yield Utils_1.Utils.generateUniqueID();
                const sign = yield Utils_1.Utils.EncryptionService({
                    institution_number,
                    mch_no,
                    channel,
                    order_no,
                    user_account_name,
                    user_account_number,
                    sub_mch_no,
                    user_bank_no,
                    user_bank_verification_number,
                    user_gps,
                    user_kyc_level,
                    amount,
                    timestamp
                });
                if (sign) {
                    const payload = {
                        channel,
                        institution_number,
                        mch_no,
                        sub_mch_no,
                        user_bank_no,
                        user_account_name,
                        user_account_number,
                        user_bank_verification_number,
                        user_kyc_level,
                        user_gps,
                        amount,
                        order_no,
                        timestamp,
                        sign
                    };
                    ApiServices_1.ApiServices.nqrGateway(payload, url).then((result) => __awaiter(this, void 0, void 0, function* () {
                        if (result && result.data.ReturnCode == " Fail") {
                            res.status(400).json({ data: result.data });
                        }
                        else if (result && result.data.ReturnCode == "Success") {
                            yield paymentTxnService_1.PaymentService.createPayment({
                                SessionID: result.SessionID,
                                NameEnquiryRef: result.NameEnquiryRef,
                                DestinationInstitutionCode: result.DestinationInstitutionCode,
                                ChannelCode: result.ChannelCode,
                                BeneficiaryAccountName: result.BeneficiaryAccountName,
                                BeneficiaryAccountNumber: result.BeneficiaryAccountNumber,
                                BeneficiaryKYCLevel: result.BeneficiaryKYCLevel,
                                BeneficiaryBankVerificationNumber: result.BeneficiaryBankVerificationNumber,
                                OriginatorAccountName: result.OriginatorAccountName,
                                OriginatorAccountNumber: result.OriginatorAccountNumber,
                                OriginatorBankVerificationNumber: result.OriginatorBankVerificationNumber,
                                OriginatorKYCLevel: result.OriginatorKYCLevel,
                                TransactionLocation: "",
                                Narration: result.Narration,
                                PaymentReference: result.PaymentReference,
                                Amount: result.Amount
                            });
                            res.status(200).json({ success: true, data: result.data });
                        }
                        else {
                            res.status(400).json({ data: result.data });
                        }
                    }));
                }
            }
            catch (error) {
                console.log(`Error querying merchant status ${error}`);
                res.status(500).send(`Internal Server Error :${error}`);
            }
        });
    }
    static dispatchWebookNotification(order_no, partner) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('this payment order: ', order_no);
            const payment = yield paymentTxnService_1.PaymentService.getSinglePayment(String(order_no));
            if (!order_no || !payment) {
                console.log('merchant id and details not found');
                return null;
            }
            if (!(partner === null || partner === void 0 ? void 0 : partner.uuid)) {
                console.log('merchant or partner uuid does not exist');
                return null;
            }
            if (!(partner === null || partner === void 0 ? void 0 : partner.webhook_url) || !(partner === null || partner === void 0 ? void 0 : partner.secret_key)) {
                console.log('no webhook information for this merchant');
                return null;
            }
            const webhookTemplate = {
                id: partner.uuid,
                // krediReference: payment?.kredi_reference,
                merchantReference: payment === null || payment === void 0 ? void 0 : payment.PaymentReference,
                beneficiaryName: payment === null || payment === void 0 ? void 0 : payment.BeneficiaryAccountName,
                beneficiaryAccountNumber: payment === null || payment === void 0 ? void 0 : payment.BeneficiaryAccountNumber,
                beneficiaryBankCode: payment === null || payment === void 0 ? void 0 : payment.DestinationInstitutionCode,
                beneficiaryKYCLevel: payment.BeneficiaryKYCLevel,
                beneficiaryBankVerificationNumber: payment.BeneficiaryBankVerificationNumber,
                originatorAccountName: payment.OriginatorAccountName,
                originatorAccountNumber: payment.OriginatorAccountNumber,
                originatorBVN: payment.OriginatorBankVerificationNumber,
                originatorKYCLevel: payment.OriginatorKYCLevel,
                transactionAmount: payment === null || payment === void 0 ? void 0 : payment.Amount,
                narration: payment.Narration,
                channelCode: payment.ChannelCode,
                transactionLocation: payment.TransactionLocation,
                sessionId: payment === null || payment === void 0 ? void 0 : payment.SessionID,
                createdAt: payment === null || payment === void 0 ? void 0 : payment.created_at,
            };
            const signature_key = (0, crypto_1.createHash)('sha512').update(`${payment === null || payment === void 0 ? void 0 : payment.Amount}-${partner === null || partner === void 0 ? void 0 : partner.secret_key}-${payment === null || payment === void 0 ? void 0 : payment.PaymentReference}`).digest('hex');
            // console.log(signature_key)
            ApiServices_1.ApiServices.sendWebookNotification(partner === null || partner === void 0 ? void 0 : partner.webhook_url, webhookTemplate, signature_key)
                .then((response) => {
                if ((response === null || response === void 0 ? void 0 : response.status) == 200 && (payment === null || payment === void 0 ? void 0 : payment.id)) {
                    // PayoutService.updatePayout(String(payment?.id), { webhook_status: true })
                    //     .then((resp) => {
                    //         console.log('webhook sent and update completed')
                    //     })
                }
            }).catch(error => {
                console.error('error sending webhook notification', error);
            });
        });
    }
}
exports.MerchantController = MerchantController;
