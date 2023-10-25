import { NextFunction, Request, Response } from "express";
import { MerchantService } from "./merchant.service";
import { Utils } from "../../common/Utils";
import { ApiServices } from "../../common/ApiServices";

import { BatchMerchant, 
         BatchMerchantData, 
         CreateMerchantPayload, 
         SubBatchMerchant, 
         SubBatchMerchantData, 
         SubMerchantPayload, 
         bindAcct
        } from "./interface/merchant.interface";

import { 
        createSubMerchantValidator, 
        fixedqrValidator, 
        } from "../../common/validators/validators";

import BadRequestError from "../../loader/error-handler/BadRequestError";
import { QRCodeService } from "../qrCode/qrCode.service";
import { PaymentService } from "../paymentTransaction/paymentTxnService";
import { AxiosResponse } from "axios";
import { createHash } from "crypto";
import ApplicationError from "../../loader/error-handler/ApplicationError";
import { IPartnerData } from "../Auth/interface/service.interface";
import { Auth } from "../Auth/auth.service";
import { WebhookService } from "../webhook/webhook.service";

let auth = new Auth()


export class MerchantController {

    static async queryAcct(account_number: string) {

        try {

            const channel = process.env.CHANNEL_NO as string;
            const institution_number = process.env.INSTITUTION_NUMBER as string;
            const bank_number = process.env.BANK_NUMBER as string;
            const url = process.env.QUERY_ACCT_URL as string

            const timestamp = String(Math.floor(Date.now() / 1000));

            const sign = await Utils.EncryptionService({
                institution_number, 
                channel, 
                bank_number, 
                account_number, 
                timestamp
            })

            const payload = {
             institution_number,
             channel,
             bank_number,
             account_number,
             timestamp,
             sign
            }

           const result = await ApiServices.nqrGateway(payload, url)
           console.log(result.status)
           return result   
         } catch (error:any) {
            console.log(`Error querying account ${error}`)
            throw new BadRequestError(error)
         }
    }

    static async createMerchant(req:Request, res:Response) {

        try {

            console.log("creating merchant")

            const institution_number = process.env.INSTITUTION_NUMBER as string;
            const bank_no = process.env.BANK_NUMBER as string;

            const { 
                account_number, 
                name, 
                tin, 
                contact, 
                address, 
                phone, 
                email, 
                m_fee_bearer, 
                account_name,
             } = req.body

             const result = await MerchantController.queryAcct(account_number);

             if (result && result.data.ReturnCode === "Fail") {
                res.status(400).json({ data: result.data });
                return;
             }

             if (result && result.data.ReturnCode === "Success") {
                const { AccountNumber, AccountName, BankVerificationNumber, KYCLevel } = result.data;

                await Promise.all([
                MerchantService.getMerchantbyAcctNo(AccountNumber),
                MerchantService.getMerchantByTin(tin),  
                ]).then(([existingAccount, existingTin]) => {
                    if (existingAccount) throw new BadRequestError("Account number already in use");
                    if (existingTin) throw new BadRequestError("A merchant exists with that tin");
                });

                const timestamp = String(Math.floor(Date.now() / 1000));

                const sign = await Utils.EncryptionService({

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
                })

                const payload1:CreateMerchantPayload = {
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
                }
 
                const url = process.env.CREATE_MERCHANT_URL as string;
                 ApiServices.nqrGateway(payload1, url).then( async result => {
                    if (result && result.data.ReturnCode == "Fail"){
                        res.json(400).json({data: result.data})
                    } else if (result && result.data.ReturnCode == "Success"){
                        const   { Mch_no } = result.data
                        MerchantController.bindMerchantAcct({ 
                        mch_no:Mch_no, 
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
                        console.log("merchant created and binded")
                       })
                    res.status(200).json({success: true, data: result.data})
                } else {
                    res.status(400).json({data: result.data})
                }
            }) 
        }
        } catch (error) { 
            res.status(500).send(`${error}`);
        }
    }

    static async bindMerchantAcct(bindDetails:bindAcct){

        try {

            const institution_number = process.env.INSTITUTION_NUMBER as string;
            const bank_no = process.env.BANK_NUMBER as string;

            const { account_name, account_number, mch_no } = bindDetails
           
            const timestamp = String(Math.floor(Date.now() / 1000)); 

            const sign = await Utils.EncryptionService({
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

            const url = process.env.BIND_MERCH_URL as string
            const result = await ApiServices.nqrGateway(payload, url)
            return result
        } catch (error:any) {
            console.log(`Error binding account ${error}`)
            throw new BadRequestError(error)
        }
    }

    static async createSubMerchant(req:Request, res:Response, next: NextFunction) {

        try {

            const institution_number = process.env.INSTITUTION_NUMBER as string;
            const url = process.env.CREATE_SUBMERCH_URL as string

            const { name, phone_number, email, sub_amount, sub_fixed, mch_no } = req.body

            //subfixed:This is an integer value used to denote if the QR code is a Fixed-Custom QR code or a Fixed-Defined QR code. “0” - Fixed-Custom QR code “1” - Fixed-Defined QR code

            const timestamp = String(Math.floor(Date.now() / 1000)); 

            const sign = await Utils.EncryptionService({
                institution_number, 
                name, 
                email, 
                phone_number, 
                sub_fixed, 
                mch_no,
                sub_amount, 
                timestamp
            })

            const payload:SubMerchantPayload = {
                institution_number,
                name,
                mch_no,
                phone_number,
                email,
                sub_fixed,
                sub_amount,
                timestamp,
                sign
            }

             ApiServices.nqrGateway(payload, url).then( async (result) => {
                if (result && result.data.ReturnCode == "Fail" ){   
                    res.status(400).json({ success: false, data: result.data})
                } else if (result && result.data.ReturnCode == "Success" ) {

                    const { Institution_number, Mch_no, Sub_name, Sub_mch_no, Emvco_code } = result.data

                    await MerchantService.createSubMerchant({
                        Institution_number, 
                        Mch_no, 
                        Sub_mch_no, 
                        Sub_name, 
                        Emvco_code, 
                        email
                        })

                    res.status(200).json({ success: true, data: result.data})
                } else {
                    res.status(500).json({ success: false, data: result.data})
                }
             })
        } catch (error) { 
            console.log(error)
            res.status(500).send(`${error}`)
        }
    }

    static async getMerchTxnRecord(req:Request, res:Response) {

        try {

            const institution_number = process.env.INSTITUTION_NUMBER as string;
            const url = process.env.MERCHANT_TXN_URL as string
            const order_type = process.env.ORDER_TYPE as string

            const { sub_mch_no, start_time, page, end_time, mch_no } = req.body

            const timestamp = String(Math.floor(Date.now() / 1000));
            const sign = await Utils.EncryptionService({
                institution_number, 
                mch_no, 
                sub_mch_no, 
                start_time, 
                end_time, 
                page, 
                order_type, 
                timestamp
            })

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
                }

                 ApiServices.nqrGateway(payload, url).then(async (result)=> {
                    if (result && result.data.ReturnCode == "Fail" ){   
                        res.status(400).json({data: result.data})
                    } else if (result && result.data.ReturnCode == "Success" ) {
                        res.status(200).json({ data: result.data})
                    } else {
                        res.status(400).json({data: result.data})
                    }
                })
            }
        } catch (error) {
            console.log(`Error getting merchant transaction ${error}`)
            res.status(500).send(`${error}`)
        }
    }

    static async createMerchInBatch(req:Request, res:Response) {

        try {

            const institution_number = process.env.INSTITUTION_NUMBER as string;
            const url = process.env.CREATE_BATCH_MERCHANT_URL as string

            const batchMerchants: BatchMerchant[] = req.body.list;

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

            const sign = await Utils.EncryptionService({institution_number, timestamp})

            const payload: BatchMerchantData = {
                institution_number,
                sign,
                timestamp,
                list: batchMerchants
            }

            ApiServices.nqrGateway(payload, url).then(async (result)=> {
                if (result && result.data.ReturnCode == "Fail" ){   
                    res.status(400).json({data: result.data})
                } else if (result && result.data.ReturnCode == "Success" ) {

                    console.log('start')

                    const { List } = result.data

                    const bindAccount = List.map(async (item) => {

                    const { Mch_no, Name, M_tin } = item;

                     const searchBatch = batchMerchants.filter((item) => item.name === Name && item.tin === M_tin)

                     console.log('middle')

                     if (searchBatch.length > 0) {
                     console.log('Matching merchant found:', searchBatch);

                     console.log('end')

                    const { account_name, account_number} = searchBatch[0]
                    
                    MerchantController.bindMerchantAcct({ 
                        mch_no:Mch_no, 
                        account_name, 
                        account_number
                    }).then( res => {
                        if (res && res.data) console.log("merchnt binded")
                        
                    })
                   }
                  });
                   await Promise.all(bindAccount);
                    res.status(200).json({ success: true, data: result.data})
                } else {
                    res.status(400).json({data: result.data})
                }
            })
        

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
        } catch (error) {
            console.log(`Error creating batch merchant `, error)
            res.status(500).send(`${error}`)
        }
    }

    static async createSubMerchInBatch(req:Request, res:Response) {

        try {

            const institution_number = process.env.INSTITUTION_NUMBER as string;
            const url = process.env.CREATE_BATCH_SUBMERCHANT_URL as string
            const { mch_no } = req.body

            const subBatchMerchants: SubBatchMerchant[] = req.body.list

            const timestamp = String(Math.floor(Date.now() / 1000)); 
            const sign = await Utils.EncryptionService({institution_number, mch_no, timestamp})

            const payload: SubBatchMerchantData = {
                             institution_number,
                             mch_no,
                             timestamp,
                             sign,
                             list: subBatchMerchants 
            }

            ApiServices.nqrGateway(payload, url).then( async result => {
                if (result && result.data.ReturnCode == "Fail"){
                    res.json(400).json({data: result.data})
                  } else if (result && result.data.ReturnCode == "Success"){
                    const   { Mch_no } = result.data

                    const { List } = result.data;

                    const saveSubMerch = List.map(async (item) => {
     
                    const { Sub_name, Sub_mch_no, Emvco_code } = item;
     
                     await MerchantService.createSubMerchant({
                         Institution_number: institution_number,
                         Mch_no: Mch_no,
                         Sub_name,
                         Sub_mch_no,
                         Emvco_code
                     })
                   });
                   await Promise.all(saveSubMerch);
                    res.status(200).json({ data: result.data})
                } else {
                    res.status(400).json({data: result.data})
                }
            })
            
        } catch (error) {
            console.log(`Error creating batch submerchant ${error}`)
            res.status(500).send(`${error}`)
        }
    }

    static async createDynamicQrCode(req:Request, res:Response, next:NextFunction) {

        try {

             const url = process.env.CREATE_DYNAMICQR_URL as string

             const { mch_no, sub_mch_no, amount } = req.body

             const firstDigit = await Utils.FirstDigitInRange(amount)

             const unique_id = await Utils.generateRandomAlphaNumeric(firstDigit)

            const channel = process.env.CHANNEL_NO as string;
            const institution_number = process.env.INSTITUTION_NUMBER as string;
            const order_type = process.env.ORDER_TYPE as string;
            const code_type = process.env.CODE_TYPE as string;
            const order_no = await Utils.generateUniqueID()

            const timestamp = String(Math.floor(Date.now() / 1000)); 

            const sign = await Utils.EncryptionService({
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
            })

            if ( sign ) {

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

                ApiServices.nqrGateway(payload, url).then(async (result) => {
                    if (result && result.data.ReturnCode == " Fail" ){   
                        res.status(400).json({data: result.data})
                    } else if (result && result.data.ReturnCode == "Success") {
                        const { OrderSn, CodeUrl } = result.data
                        MerchantService.getMerchantByMchNo(mch_no).then( merch => {
                            QRCodeService.createQrCode({ Order_sn: OrderSn, CodeUrl, mch_no, order_no, mch_ID: merch.id})
                            .then( res => {
                                console.log("qr code created")
                            })
                        })
                        res.status(200).json({ success: true, data: result.data})
                    } else {
                        res.status(400).json({data: result.data})
                    }
                })  
            }
        } catch (error:any) {
            console.log(`Error creating dynamic qr code ${error}`);
            return next(new ApplicationError(error))
        }
    }

    static async createFixedQrCode(req:Request, res:Response, next: NextFunction) {

        try {

            const institution_number = process.env.INSTITUTION_NUMBER as string;
            const url = process.env.CREATE_SUBMERCH_URL as string

            const { name, phone_number, email, sub_amount, sub_fixed, mch_no } = req.body

            //subfixed:This is an integer value used to denote if the QR code is a Fixed-Custom QR code or a Fixed-Defined QR code. “0” - Fixed-Custom QR code “1” - Fixed-Defined QR code

            const timestamp = String(Math.floor(Date.now() / 1000)); 
            const order_no = await Utils.generateUniqueID()

            const sign = await Utils.EncryptionService({
                institution_number, 
                name, 
                email, 
                phone_number, 
                sub_fixed, 
                mch_no,
                sub_amount, 
                timestamp
            })

            if ( sign ) {
                const payload:SubMerchantPayload = {
                    institution_number,
                    name,
                    mch_no,
                    phone_number,
                    email,
                    sub_fixed,
                    sub_amount,
                    timestamp,
                    sign
                }
    
                 ApiServices.nqrGateway(payload, url).then( async (result) => {
                    if (result && result.data.ReturnCode == "Fail" ){   
                        res.status(400).json({ success: false, data: result.data})
                    } else if (result && result.data.ReturnCode == "Success" ) {
                        const { Emvco_code, Mch_no, Sub_mch_no, Sub_name } = result.data
                        MerchantService.getMerchantByMchNo(Mch_no).then( merch => {
                            QRCodeService.createQrCode({ CodeUrl: Emvco_code, mch_no: Mch_no, order_no, mch_ID: "bole"})
                            .then( res => {
                                console.log("qr code created")
                            })
                        })
                        await MerchantService.createSubMerchant({
                            Institution_number: institution_number, 
                            Mch_no, 
                            Sub_mch_no, 
                            Sub_name, 
                            Emvco_code, 
                            email
                            })
                        res.status(200).json({ data: result.data})
                    } else {
                        res.status(400).json({ data: result.data})
                    }
                 })
            }
            } catch (error:any) { 
                console.log(error)
                return next(new ApplicationError(error))
            }

    }

    static async cancelDynamicQrCode(req:Request, res:Response, next:NextFunction) {

        try {

            const { order_sn } = req.body

            const institution_number = process.env.INSTITUTION_NUMBER as string;
            const url = process.env.CANCEL_DYNAMICQR_URL as string

            const timestamp = String(Math.floor(Date.now() / 1000)); 
            const sign = await Utils.EncryptionService({institution_number, order_sn, timestamp})

            if (sign) {

                const payload = {
                    institution_number,
                    order_sn,
                    timestamp,
                    sign    
                };

                ApiServices.nqrGateway(payload, url).then(async (result)=> {
                    if (result && result.data.ReturnCode == "Fail" ){   
                        res.status(400).json({data: result.data})
                    } else if (result && result.data.ReturnCode == "Success") {
                        res.status(200).json({ success: true, data: result.data})
                    } else {
                        res.status(400).json({data: result.data})
                    }
                })  
            } 
        } catch (error:any) {
            console.log(`Error canceling qr code ${error}`)
            return next(new ApplicationError(error))
        }
    }

    static async queryPaymentStatus(): Promise<any[]> {

        try {

          console.log('Checking for payment status');

          const orders = await QRCodeService.getPaymentOrderStatus();

          if (!orders || orders.length == 0 || orders == null) {
            console.log('no order record due for processing')
          }
      
            const institution_number = process.env.INSTITUTION_NUMBER as string;
            const url = process.env.QUERY_ORDER_STATUS_URL as string;

            const checkingOrders = orders.map( async (order) => {
            const { order_no } = order;

            const timestamp = String(Math.floor(Date.now() / 1000));
            
            const sign = await Utils.EncryptionService({ institution_number, order_no, timestamp });

            if (!sign) {
                return null;
            }

            const payload = {
                institution_number,
                order_no,
                timestamp,
                sign,
            };

            const result = await ApiServices.nqrGateway(payload, url)
            if (result && result.data.ReturnCode === "Success") {
                QRCodeService.updateQrCode(order_no).then( async resp => {

                    const getOrder = await QRCodeService.getQRCodeByOrderNo(order_no)
                    if(!getOrder){
                        console.log("order does not exist")
                        return;
                    }

                    const merch = await MerchantService.getMerchantByMchNo(getOrder.mch_no)
                    if (!merch || merch == null){
                        console.log("merchant does not exist")
                        return;
                    }
                    const partnerId = Number(merch.partner_id)
                    let partner: IPartnerData = await auth.getAuthData(partnerId)

                    if(!partner || partner == null) {
                        const partnerDetails: IPartnerData | any = await WebhookService.findPartnerWebhook(Number(merch.partner_id))
                        const partnerData = partnerDetails[0]
                        if(partnerDetails && 'uuid' in partnerData) {
                            console.log('setting new partner data to cache')
                            await auth.setAuthDetails(partnerId, partnerData)
                            partner = partnerData
                        }
                    }
                   
                    await MerchantController.dispatchWebookNotification(order.id, partner)
                    console.log("Updated QR code for order:", order_no);
                })    
            }
            return result
        })

        const processedOrders = await Promise.all(checkingOrders);

        return processedOrders.filter((result) => result !== null)

        //   for (let order of orders) {

        //     const { order_no } = order;

        //     const timestamp = String(Math.floor(Date.now() / 1000));
        //     const sign = await Utils.EncryptionService({ institution_number, order_no, timestamp });

        //     if (sign) {
        //         const payload = {
        //             institution_number,
        //             order_no,
        //             timestamp,
        //             sign,
        //           };
                 
        //             ApiServices.nqrGateway(payload, url).then(async result => {
        //               if (result && result.data.ReturnCode == "Fail") {
        //                   return
        //               } else if (result && result.data.ReturnCode == "Success"){
        //                   QRCodeService.updateQrCode(order_no).then( resp => {
        //                       results.push(result.data);
        //                       console.log("updated")
        //                   })
        //                   console.log(results)
        //                   return results
        //               } else {
        //                   return
        //               }
        //             }) 
        //         }
        //     }
        //   return results
        } catch (error:any) {
          console.log(`Error querying payment status: ${error}`);
          throw new BadRequestError(error)
        }
      }    

    static async queryMerchantStatus(req:Request, res:Response, next:NextFunction) {
        try {
            const { qr_cate, sub_no } = req.body
            const institution_number = process.env.INSTITUTION_NUMBER as string;
            const url = process.env.QUERY_MERCHANT_STATUS_URL as string

            const timestamp = String(Math.floor(Date.now() / 1000));

            const sign = await Utils.EncryptionService({institution_number, 
                qr_cate, 
                sub_no, 
                timestamp
            })

            if (sign ) {
                const payload = {
                    institution_number,
                    qr_cate,
                    sub_no,
                    timestamp,
                    sign    
                };
                ApiServices.nqrGateway(payload, url).then(async (result)=> {
                    if (result && result.data.ReturnCode == " Fail" ){   
                        res.status(400).json({data: result.data})
                    } else if (result && result.data.ReturnCode == "Success") {
                        res.status(200).json({ success: true, data: result.data})
                    } else {
                        res.status(400).json({data: result.data})
                    }
                }) 
            }    
        } catch (error:any) {
            console.log(`Error querying merchant status ${error}`)
            return next(new ApplicationError(error))
        }
    }

    static async queryTransactionFee(req:Request, res:Response) {
        try {
            const { mch_no, sub_mch_no, amount } = req.body
            const institution_number = process.env.INSTITUTION_NUMBER as string;
            const url = process.env.TRANSACTION_FEE_URL as string
            const user_bank_no = process.env.BANK_NUMBER as string;

            const timestamp = String(Math.floor(Date.now() / 1000));

            const sign = await Utils.EncryptionService({
                institution_number, 
                mch_no, 
                sub_mch_no, 
                user_bank_no, 
                amount, 
                timestamp
            })
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
               ApiServices.nqrGateway(payload, url).then( async result => {
                    if (result && result.data.ReturnCode == "Fail"){
                        res.json(400).json({data: result.data})
                    } else if (result && result.data.ReturnCode == "Success"){
                        res.status(200).json({success: true, data: result.data})
                    } else {
                        res.status(400).json({data: result.data})
                    }
                })
            }
        } catch (error) {
            console.log(`Error querying merchant status ${error}`)
            res.status(500).send(`${error}`)
        }
    }

    static async createTransactionDynamicQrCode(req:Request, res:Response) {

        try {

            const user_bank_no = process.env.BANK_NUMBER as string;
            const user_gps = ""

            const { 
                user_kyc_level,  
                user_account_name, 
                user_account_number, 
                order_sn, 
                order_amount, 
                user_bank_verification_number
             } = req.body

            const institution_number = process.env.INSTITUTION_NUMBER as string;
            const url = process.env.CREATE_TXN_DYNAMICQR_URL as string

            const timestamp = String(Math.floor(Date.now() / 1000)); 

            const sign = await Utils.EncryptionService({
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
            })

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
                 ApiServices.nqrGateway(payload, url).then(async (result)=> {
                    if (result && result.data.ReturnCode == " Fail" ){   
                        res.status(400).json({data: result.data})
                    } else if (result && result.data.ReturnCode == "Success") {
                        await PaymentService.createPayment({
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
                              Amount : result.data.Amount
                   })
                        res.status(200).json({ success: true, data: result.data})
                    } else {
                        res.status(400).json({data: result.data})
                    }
                })
            }
        } catch (error) {
            console.log(`Error querying merchant status ${error}`)
            res.status(500).send(`${error}`)
        }
      }

     static async createTransactionFixedQrCode(req:Request, res:Response) {

        try {

            console.log("transaction for fixed qr code")

            // const { error, value } = fixedqrValidator(req.body)
            // if (error) throw new Exception(400, `${error.details[0].message}`)

            const user_bank_no = process.env.BANK_NUMBER as string;
            const user_gps = ""
            const channel = process.env.CHANNEL_NO as string;

            const { 
                mch_no, 
                sub_mch_no, 
                user_kyc_level, 
                user_account_name, 
                user_account_number, 
                amount, 
                user_bank_verification_number
            } = req.body

            const institution_number = process.env.INSTITUTION_NUMBER as string;
            const url = process.env.CREATE_TXN_FIXEDQR_URL as string

            const timestamp = String(Math.floor(Date.now() / 1000)); 
            const order_no = await Utils.generateUniqueID()

            const sign = await Utils.EncryptionService({
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
            })

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
                 ApiServices.nqrGateway(payload, url).then(async (result)=> {
                    if (result && result.data.ReturnCode == " Fail" ){   
                        res.status(400).json({data: result.data})
                    } else if (result && result.data.ReturnCode == "Success") {
                        await PaymentService.createPayment({
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
                    Amount : result.Amount
                   })
                        res.status(200).json({ success: true, data: result.data})
                    } else {
                        res.status(400).json({data: result.data})
                    }
                })
            }

        } catch (error) {
            console.log(`Error querying merchant status ${error}`)
            res.status(500).send(`${error}`)
        }
     }

     static async dispatchWebookNotification(orderId, partner) {
        console.log('this payment order: ', orderId)
        const payment = await PaymentService.getSinglePayment(String(orderId))

        if (!orderId || !payment) {
            console.log('merchant id and details not found')
            return null
        }

        if (!partner?.uuid) {
            console.log('merchant or partner uuid does not exist')
            return null
        }

        if (!partner?.webhook_url || !partner?.secret_key) {
            console.log('no webhook information for this merchant')
            return null
        }

        const webhookTemplate = {
             id: partner.uuid,
            // krediReference: payment?.kredi_reference,
             merchantReference: payment?.PaymentReference,
             beneficiaryName: payment?.BeneficiaryAccountName,
             beneficiaryAccountNumber: payment?.BeneficiaryAccountNumber,
             beneficiaryBankCode: payment?.DestinationInstitutionCode,
             beneficiaryKYCLevel: payment.BeneficiaryKYCLevel,
             beneficiaryBankVerificationNumber: payment.BeneficiaryBankVerificationNumber,
             originatorAccountName: payment.OriginatorAccountName,
             originatorAccountNumber: payment.OriginatorAccountNumber,
             originatorBVN: payment.OriginatorBankVerificationNumber,
             originatorKYCLevel: payment.OriginatorKYCLevel,
             transactionAmount: payment?.Amount,
             narration: payment.Narration,
             channelCode: payment.ChannelCode,
             transactionLocation: payment.TransactionLocation,
             sessionId: payment?.SessionID,
             createdAt: payment?.created_at,
        }

         const signature_key = createHash('sha512').update(`${payment?.Amount}-${partner?.secret_key}-${payment?.PaymentReference}`).digest('hex');
        // console.log(signature_key)

        ApiServices.sendWebookNotification(partner?.webhook_url, webhookTemplate, signature_key)
            .then((response: AxiosResponse | any) => {
                if (response?.status == 200 && payment?.id) {
                    // PayoutService.updatePayout(String(payment?.id), { webhook_status: true })
                    //     .then((resp) => {
                    //         console.log('webhook sent and update completed')
                    //     })
                }
            }).catch(error => {
                console.error('error sending webhook notification', error)
            })
    }
}