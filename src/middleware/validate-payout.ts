
import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import BadRequestError from "../loader/error-handler/BadRequestError";

const validatePayout = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        let {
            transaction_reference,
            transaction_amount,
            beneficiary_account_no,
            beneficiary_account_name,
            beneficiary_entity_code,
            narration
        } = req.body;

        const Schema = Joi.object({
            transaction_reference: Joi
                .string()
                .min(3)
                .max(100)
                .pattern(new RegExp('^[a-zA-Z0-9-_]{3,100}$'))
                .required()
                .messages({
                    'string.min': `transaction_reference length cannot be less than 3 or more than 100 characters long`,
                }),
            transaction_amount: Joi.number().required(),
            beneficiary_account_no: Joi.string().length(10).required(), //pattern(new RegExp('^[0-9]{10}$'))
            beneficiary_account_name: Joi.string().max(100).required(),
            beneficiary_entity_code: Joi.string().max(6).required(),
            narration: Joi.string()
        });

        await Schema.validateAsync({
            transaction_reference,
            transaction_amount,
            beneficiary_account_no,
            beneficiary_account_name,
            beneficiary_entity_code,
            narration
        });


        next();
    } catch (error: any) {
        return next(new BadRequestError(error.message));
    }
};

export default validatePayout;