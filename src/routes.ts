import { Router } from "express";
import merchantRouter from "./features/gateway/merchant.routes"
import validateToken from "./middleware/validate-token";


const router = Router();

router.use("/api", merchantRouter);

export default router