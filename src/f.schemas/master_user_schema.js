import Joi from 'joi';

export const master_user_schema = Joi.object({
  email: Joi.string().email().required(),
});

export const master_token_schema = Joi.object({
  email: Joi.string().email().required(),
  token_access: Joi.string().pattern(/^\d{6}$/).required(),
})