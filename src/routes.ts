import { Router, Request, Response } from "express";
import Constant from "./constant";
import merchantRouter from "./features/merchant/merchant.routes"


const router = Router();

router.get("/test", async (req: Request, res: Response) => {
 
  res.status(Constant.statusCode.OK).json({
    success: true,
    message: Constant.messages.apiHealth,
    data: { code: Constant.statusCode.OK},
  });
});

router.use("/api", merchantRouter);

export default router