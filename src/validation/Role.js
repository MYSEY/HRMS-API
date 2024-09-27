import { Joi } from "express-validation";

export const roleCreateRequest = {
  body: Joi.object({
    role_name: Joi.string().required(), 
    description: Joi.string(),
    type: Joi.string().valid('BRANCH', 'COMPANY', 'ROOT').required(),
    permissions: Joi.array().items(),
  }),
};
export const roleUpdateRequest = {
  body: Joi.object({
    role_name: Joi.string(), 
    description: Joi.string(),
    type: Joi.string().valid('BRANCH', 'COMPANY', 'ROOT').required(),
    old_permissions: Joi.array().items(),
    new_permissions: Joi.array().items(),
  }),
};