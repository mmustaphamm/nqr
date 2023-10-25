
import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import BadRequestError from "../loader/error-handler/BadRequestError";

export const createMerchValidator = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let {
            name,
            tin,
            contact,
            phone,
            email,
            address,
            account_name,
            account_number
        } = req.body;

        const Schema = Joi.object({
            address: Joi.string().required(),
            phone: Joi.string().required(),
            contact: Joi.string().required(),
            account_number: Joi.string().length(10).required(), //pattern(new RegExp('^[0-9]{10}$'))
            account_name: Joi.string().required(),
            tin: Joi.string().min(8).max(15).required(),
            email: Joi.string().email().required(),
            name: Joi.string().required()
        });

        await Schema.validateAsync({
            name,
            contact,
            tin,
            account_name,
            account_number,
            email,
            address,
            phone
        });
        next();
    } catch (error: any) {
        return next(new BadRequestError(error.message));
    }
};

export const createSubMerchValidator = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let {
            name,
            email,
            mch_no,
            sub_amount,
            sub_fixed,
            phone_number,
        } = req.body;

        const Schema = Joi.object({
            phone_number: Joi.string().required(),
            email: Joi.string().email().required(),
            mch_no: Joi.string().required(),
            name: Joi.string().required(),
            sub_amount: Joi.string().required(),
            sub_fixed: Joi.string()
        });

        await Schema.validateAsync({
            name,
            email,
            mch_no,
            sub_amount,
            sub_fixed,
            phone_number
        });
        next();
    } catch (error: any) {
        return next(new BadRequestError(error.message));
    }
};

export const dynamicqrValidator = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let {
            mch_no,
            amount,
            sub_mch_no,
        } = req.body;

        const Schema = Joi.object({
            mch_no: Joi.string().required(),
            sub_mch_no: Joi.string().required(),
            amount: Joi.string().required(),
        });

        await Schema.validateAsync({
            mch_no,
             amount,
            sub_mch_no,
   
        });
        next();
    } catch (error: any) {
        return next(new BadRequestError(error.message));
    }
};