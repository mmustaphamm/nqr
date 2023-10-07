import { IPaymentRail, baseUrl } from "./interface/kredi.interface"
import * as dotenv from "dotenv"
dotenv.config()

export const paymentRail: IPaymentRail = {
    account: process.env.RAIL as string,
    accounts: {
        nip: process.env.NIP_URL as string,
        stanbic: process.env.STANBIC_URL as string,
    },
    secretKey: process.env.PAYOUT_SECRET_KEY as string,
    generalLedgerId: Number(process.env.GENERAL_LEDGER_ID) as number,
    tsqUrl: process.env.TSQ_URL as string
}

export const baseUrls: baseUrl = {
    userService: process.env.USER_SERVICE as string
}