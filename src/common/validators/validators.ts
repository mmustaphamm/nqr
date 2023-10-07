import Joi from "joi"

export const usersValidator = (email:string) => {
    const schema = Joi.object({
      email: Joi.string().trim().required().email().label("email")
    });
    const options = {
      errors: {
        wrap: {
          label: "",
        },
      },
    };
    return schema.validate(email, options);
  };
