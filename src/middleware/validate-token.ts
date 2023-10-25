// import { cache } from '../loader/database/redis'
import { NextFunction, Request, Response } from "express";
import BadRequestError from "../loader/error-handler/BadRequestError";
import NotAuthorizeError from "../loader/error-handler/NotAuthorizeError";
import { ApiServices } from "../common/ApiServices";
import { createHash } from 'crypto';
import { WebhookService } from "../features/webhook/webhook.service";
import { IWebhook } from "../features/webhook/interface/service.interface";
import ForbiddenError from '../loader/error-handler/ForbiddenError';
import app from '../config/app';
import { Utils } from "../common/Utils";


const signatureVerification = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    //const partner = res.locals.partner
    const signatureKey = req.headers['signature-key']
    //const { mch, timestamp } = req.body

    if ( !signatureKey ) {
        return next(new NotAuthorizeError('Unauthorized attempt! provide your signature'))
    }


    // compute signature
    const sortedPayload = Object.entries(req.body)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('&');
    const mac: string = createHash('md5').update(
        `${sortedPayload}`
    ).digest('hex');

   // terminate if signature does not match
    if (mac !== signatureKey) {
        console.log(mac)
        return next(new ForbiddenError('Forbidden! unauthenticated'))
    }

    return 
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
            res.set("WWW-Authenticate", "Bearer realm= Access Token, charset=UTF-8")
            return next(
                new NotAuthorizeError("Bad Request  :Invalid Authorization")
            );
        }

        // get from cache
        const cacheData = false //await cache.get(`${token}${apiKey}`)
        let partner: any = cacheData //: merchantData = cacheData

        if (!cacheData) {
            // call the Auth service
            const apiData = await ApiServices.getPartner(token, `${apiKey}`)
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
        let webhook;

        // don't require signature on the local env
        if (app.server.env !== 'local') {
            webhook = await signatureVerification(req, res, next)
        } else {
            webhook = await WebhookService.getWebhookByPartner(partner.id, 'inward')
            if (!webhook) return next(new NotAuthorizeError('provide your secret key'))
        }
        next();

    } catch (error: any) {
        return next(new BadRequestError(error))
    }
}

export default validateToken