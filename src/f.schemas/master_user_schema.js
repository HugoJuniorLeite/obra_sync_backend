import Joi from 'joi';

export const master_user_schema = Joi.object({
  email: Joi.string().email().required(),
});
