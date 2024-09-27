import { Joi } from "express-validation";

export const userCreateRequest = {
  body: Joi.object({
    number_employee: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
    role_id: Joi.number().required(),
  }),
};

export const userUpdateRequest = {
  body: Joi.object({
    number_employee: Joi.string(),
    email: Joi.string(),
    role_id: Joi.number(),
  }),
};


export const loginInRequest = {
  body: Joi.object({
    number_employee: Joi.string().required(),
    password: Joi.string().required(),
  }),
};
