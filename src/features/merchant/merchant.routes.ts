import { Router } from "express";
import { MerchantController } from "./merchant.controller";



const router = Router();

router.post('/query-acct', MerchantController.queryAcct);
router.post('/create-merchant', MerchantController.createMerchant);
router.post("/create-submerchant", MerchantController.createSubMerchant);
router.post("/bind-account", MerchantController.bindMerchantAcct);
router.post("/merchant-transaction-record", MerchantController.getMerchTxnRecord);
router.post("/create-batch-merchants", MerchantController.createMerchInBatch);
router.post("/create-batch-submerchants", MerchantController.createSubMerchInBatch);


export default router;