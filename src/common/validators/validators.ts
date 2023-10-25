import Joi from "joi"

  export const createSubMerchantValidator = (details) => {
    const schema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      phone_number: Joi.string().required(),
      mch_no: Joi.string().required(),
      sub_amount: Joi.string().required(),
      sub_fixed: Joi.string().required(),
    });
    const options = {
      errors: {
        wrap: {
          label: "",
        },
      },
    };
    return schema.validate(details, options);
  };


  export const fixedqrValidator = (details) => {
    const schema = Joi.object({
      mch_no: Joi.string().required(),
      sub_mch_no: Joi.string().required(),
      amount: Joi.string().required(),
      user_kyc_level: Joi.string().required(),
      user_account_number: Joi.string().max(10).required(),
      user_account_name: Joi.string().required(),
      user_bank_verification_number: Joi.string().required(),
      order_no: Joi.string().required(),
     
    });
    const options = {
      errors: {
        wrap: {
          label: "",
        },
      },
    };
    return schema.validate(details, options);
  };
