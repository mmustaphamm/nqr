import { Router } from "express";
import { MerchantController } from "./merchant.controller";
import { createMerchValidator, createSubMerchValidator, dynamicqrValidator } from "../../middleware/validate-inputs";

const router = Router();

router.post('/create-merchant', createMerchValidator, MerchantController.createMerchant);
router.post("/create-submerchant", createSubMerchValidator, MerchantController.createSubMerchant);
router.post("/transaction-record", MerchantController.getMerchTxnRecord);
router.post("/create-batch-merchants", MerchantController.createMerchInBatch);
router.post("/create-batch-submerchants", MerchantController.createSubMerchInBatch);
router.post("/generate-dynamic-qrcode", dynamicqrValidator, MerchantController.createDynamicQrCode)
router.post("/generate-fixed-qrcode", MerchantController.createFixedQrCode)
router.post("/cancel-dynamic-qrcode", MerchantController.cancelDynamicQrCode)
router.post("/query-payment-status", MerchantController.queryPaymentStatus)
router.post("/query-merchant-status", MerchantController.queryMerchantStatus)
router.post("/query-transaction-fee", MerchantController.queryTransactionFee)
router.post("/create-dynamicqr-transaction", MerchantController.createTransactionDynamicQrCode)
router.post("/create-fixedqr-transaction", MerchantController.createTransactionFixedQrCode)

export default router;