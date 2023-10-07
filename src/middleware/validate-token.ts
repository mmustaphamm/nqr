// import { cache } from '../loader/database/redis'
import { NextFunction, Request, Response } from "express";
import BadRequestError from "../loader/error-handler/BadRequestError";
import NotAuthorizeError from "../loader/error-handler/NotAuthorizeError";
import { ApiServices } from "../common/ApiServices";
import { merchantData } from '../feature/Auth/interface/service.interface';
import { createHash } from 'crypto';
import { WebhookService } from '../feature/webhook/webhook.service';
import { IWebhook } from '../feature/webhook/interface/service.interface';
import ForbiddenError from '../loader/error-handler/ForbiddenError';
import app from '../config/app';


const signatureVerification = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const partner = res.locals.partner
    const signatureKey = req.headers['signature-key']
    const { transaction_reference, transaction_amount } = req.body

    if (!partner || !signatureKey || !transaction_amount || !transaction_reference) {
        return next(new NotAuthorizeError('Unauthorized attempt! provide your signature'))
    }

    const webhook: IWebhook | null = await WebhookService.getWebhookByPartner(partner.id, 'outward')

    if (!webhook) return next(new NotAuthorizeError('provide your secret key'))

    // compute signature
    const mac: string = createHash('sha512').update(
        `${transaction_amount}-${webhook.secret_key}-${transaction_reference}`
    ).digest('hex');

    // terminate if signature does not match
    if (mac !== signatureKey) {
        console.log(mac)
        return next(new ForbiddenError('Forbidden! unauthenticated'))
    }

    return webhook

}


const validateToken = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    // console.log(redis)
    try {
        const { authorization } = req.headers
        const apiKey = req.headers['x-api-key']

        if ((authorization === undefined || authorization === "") || (apiKey === undefined || apiKey === "")) {
            return next(new BadRequestError("Provide authentication credentials"));
        }

        let bearer: string = "";
        let token: string = "";
        [bearer, token] = authorization.split(" ");

        if (bearer !== "Bearer") {
            res.set("WWW-Authenticate", "Bearer realm= Access Token , charset=UTF-8")
            return next(
                new NotAuthorizeError("Bad Request  :Invalid Authorization")
            );
        }

        // get from cache
        const cacheData = false //await cache.get(`${token}${apiKey}`)
        let partner: any = cacheData //: merchantData = cacheData

        if (!cacheData) {
            // call the Auth service
            const apiData = await ApiServices.getPartner(token, apiKey)
            partner = apiData?.data?.data
            if (partner.id && partner?.glId) {
                //await cache.set(`${token}${apiKey}`, partner)
            } else {
                console.log(apiData)
                return next(new BadRequestError("Merchant profile is not complete"))
            }
        }

        console.log("merchant authenticated")
        res.locals.partner = partner || null
        let webhook: IWebhook | null = null

        // don't require signature on the local env
        if (app.server.env !== 'local') {
            webhook = await signatureVerification(req, res, next)
        } else {
            webhook = await WebhookService.getWebhookByPartner(partner.id, 'outward')
            if (!webhook) return next(new NotAuthorizeError('provide your secret key'))
        }

        res.locals.webhook = webhook
        next();

    } catch (error: any) {
        return next(new BadRequestError(error))
    }
}

export default validateToken