import { Request, Response } from "express";
import { MerchantService } from "./merchant.service";
import { Utils } from "../../common/Utils";
import { ApiServices } from "../../common/ApiServices";
import {  BatchMerchant, BatchMerchantData, CreateMerchantPayload, SubMerchantPayload } from "./interface/merchant.interface";
import { usersValidator } from "../../common/validators/validators";

export class MerchantController {

    static async queryAcct(req:Request, res:Response) {
        try {
            const {
                account_number,
            } = req.body
           const timestamp = String(Math.floor(Date.now() / 1000));
           const sign = await Utils.EncryptionService({institution_number: "I0000000145", channel: "1", bank_number: "999998", account_number, timestamp})
            const payload = {
             account_number, timestamp, sign
            }
           const result = await ApiServices.merchantQuery(payload)
            res.status(200).send(result)
        } catch (error) {
            res.status(500).send(`Error querying account ${error}`)
        }
    }


    static async createMerchant(req:Request, res:Response) {
        try {
            const {
            name,
            tin,
            contact,
            phone,
            email,
            address,
            account_name,
            account_number,
            m_fee_bearer
            } = req.body

            //const { error, value } = usersValidator(email);
            //if (error) throw new Error(error.details[0].message)

            // await Promise.all([
            //     MerchantService.getMerchantbyAcctNo(account_number),
            //     MerchantService.getMerchantByTin(tin),
            //     MerchantService.getMerchantByEmail(email)
            // ]).then(([existingAccount, existingTin, existingEmail]) => {
            //     if (existingAccount) throw new Error("A merchant exists with that account number");
            //     if (existingTin) throw new Error("A merchant exists with that tin");
            //     if (existingEmail) throw new Error("A merchant exists with that email");
            // });

            //const timestamp = String(Math.floor(Date.now() / 1000)); 
            const sign = await Utils.EncryptionService({institution_number: "I0000000145", name, tin, contact, phone, email, address, bank_no: "999998", account_name, account_number, m_fee_bearer, timestamp: "1696509536"})
            // const payload:CreateMerchantPayload = {institution_number,
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
            //     sign}

          // const createMerchant = await ApiServices.createMerchant(payload)
              //  await MerchantService.createMerchant({...payload, merchant_number: "1234567"})
            res.status(200).json({sign})
        } catch (error) { 
            res.status(500).send(`Internal server error :${error}`)
        }
    }

    static async bindMerchantAcct(req:Request, res:Response){
        try {
            const { institution_number,
            mch_no,
            bank_no,
            account_name,
            account_number,
            } = req.body

            const timestamp = String(Math.floor(Date.now() / 1000)); 
            const sign = await Utils.EncryptionService({institution_number, mch_no, bank_no, account_name, account_number, timestamp})
            const payload = {
                institution_number, mch_no, bank_no, account_name, account_number, timestamp, sign
            }
            const result = await ApiServices.bindAccount(payload)
            res.status(200).json({message: "successful", sign, result: result})
        } catch (error) {
            res.status(500).send(`Error binding merchant ${error}`)
        }
    }

    static async createSubMerchant(req:Request, res:Response) {
        try {
            const { institution_number,
            name,
            mch_no,
            phone_number,
            email,
            sub_fixed,
            sub_amount,
            } = req.body

            // const { error, value } = usersValidator({email});
            // if (error) throw new Error(error.details[0].message)

            const existingSub = await MerchantService.createSubMerchant(mch_no)
            if (existingSub) throw new Error("Cannot create sub account for this merchant")

            const timestamp = String(Math.floor(Date.now() / 1000)); 
            const sign = await Utils.EncryptionService({institution_number, name, email, phone_number, sub_fixed, sub_amount, timestamp})
            const payload:SubMerchantPayload = {institution_number,
                name,
                mch_no,
                phone_number,
                email,
                sub_fixed,
                sub_amount,
                timestamp,
                sign}
            //const result = await ApiServices.createSubMerchAccount(payload)
            // if (result && result.ReturnCode === "Success") {
            //     const { Sub_mch_no, Emvco_code } = result.data
                await MerchantService.createSubMerchant({...payload, sub_mch_no: "123456", emvco_code: "123456"})
            //}
            res.status(200).json({message: "merchant successfully created"})
        } catch (error) { 
            res.status(500).send(`Internal server error :${error}`)
        }
    }

    static async getMerchTxnRecord(req:Request, res:Response) {
        try {
            const { id } = req.params;
            const {start_time, end_time} = req.body
            const merchant = await MerchantService.getMerchantByEmail(id)
            if (merchant == null || merchant == undefined) throw new Error("merchant does not exist")
            const {institution_number, merchant_number} = merchant
           
            const subMerchant = await MerchantService.getSubMerchantbyMchNo(merchant.merchant_number)
            const timestamp = String(Math.floor(Date.now() / 1000));
            const sign = await Utils.EncryptionService({institution_number, mch_no: merchant_number, timestamp})

            const payload = {institution_number,
                             mch_no: merchant_number,
                             sub_mch_no: subMerchant?.sub_mch_no,
                             start_time,
                             end_time,
                             order_type: "4",
                             page: "1",
                             timestamp,
                             sign
            }

            const result = await ApiServices.getMerchTxnRecord(payload)
            res.status(200).json({message: "Transaction record successfully fetched", data: result.data})
        } catch (error) {
            console.log(`Error getting merchant transaction ${error}`)
            res.status(500).send(`Internal Server Error :${error}`)
        }
    }

    static async createMerchInBatch(req:Request, res:Response) {
        try {
            const batchMerchants: BatchMerchant[] = req.body.list

            for (const merchants of batchMerchants) {
                await Promise.all([
                    MerchantService.getMerchantbyAcctNo( merchants.account_number),
                    MerchantService.getMerchantByTin(merchants.tin),
                    MerchantService.getMerchantByEmail(merchants.email)
                ]).then(([existingAccount, existingTin, existingEmail]) => {
                    if (existingAccount) throw new Error("A merchant exists with that account number");
                    if (existingTin) throw new Error("A merchant exists with that tin");
                    if (existingEmail) throw new Error("A merchant exists with that email");
                });
            }
            const timestamp = String(Math.floor(Date.now() / 1000)); 
            const sign = await Utils.EncryptionService({institution_number: "10000000145", timestamp})
            const payload: BatchMerchantData = {institution_number: "10000000145",
                             timestamp,
                             sign,
                             list: batchMerchants 
            }
            const result = await ApiServices.createMerchantsInBatch(payload)
            if (result && result.data.ReturnCode === "Success"){
                const returnedData = result.data.list;
                for (const stuff of returnedData) {
                    const { Mch_no } = stuff
                   // await MerchantService.createMerchant({... merchant_number: Mch_no})

                }
            }
        } catch (error) {
            console.log(`Error creating batch merchant ${error}`)
            res.status(500).send(`Internal Server Error :${error}`)
        }
    }

    static async createSubMerchInBatch(req:Request, res:Response) {
        try {
            const batchMerchants: BatchMerchant[] = req.body.list

            for (const merchants of batchMerchants) {
                await Promise.all([
                    MerchantService.getMerchantbyAcctNo( merchants.account_number),
                    MerchantService.getMerchantByTin(merchants.tin),
                    MerchantService.getMerchantByEmail(merchants.email)
                ]).then(([existingAccount, existingTin, existingEmail]) => {
                    if (existingAccount) throw new Error("A merchant exists with that account number");
                    if (existingTin) throw new Error("A merchant exists with that tin");
                    if (existingEmail) throw new Error("A merchant exists with that email");
                });
            }
            const timestamp = String(Math.floor(Date.now() / 1000)); 
            const sign = await Utils.EncryptionService({institution_number: "10000000145", timestamp})
            const payload: BatchMerchantData = {institution_number: "10000000145",
                             timestamp,
                             sign,
                             list: batchMerchants 
         }
            const result = await ApiServices.createSubMerchantsInBatch(payload)
            if (result && result.data.ReturnCode === "Success"){
                const returnedData = result.data.list;
                for (const stuff of returnedData) {
                    const { Mch_no } = stuff
                   // await MerchantService.createMerchant({... merchant_number: Mch_no})

                }
            }
        } catch (error) {
            console.log(`Error creating batch submerchant ${error}`)
            res.status(500).send(`Internal Server Error :${error}`)
        }
    }

}