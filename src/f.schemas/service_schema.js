import Joi from 'joi';

export const service_schema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(255)
    .required()
    .messages({
      'string.base': 'O nome deve ser um texto.',
      'string.empty': 'O nome é obrigatório.',
      'string.min': 'O nome deve ter pelo menos {#limit} caracteres.',
      'string.max': 'O nome deve ter no máximo {#limit} caracteres.',
      'any.required': 'O nome é obrigatório.'
    }),

  description: Joi.string()
    .max(1000)
    .allow(null, '')
    .messages({
      'string.base': 'A descrição deve ser um texto.',
      'string.max': 'A descrição deve ter no máximo {#limit} caracteres.'
    }),

  price: Joi.number()
    .positive()
    .precision(2)
    .required()
    .messages({
      'number.base': 'O preço deve ser numérico.',
      'number.positive': 'O preço deve ser maior que zero.',
      'any.required': 'O preço é obrigatório.'
    }),

  project_id: Joi.number()
    .positive()
    .required()
    .messages({
      'number.base': 'O id do projeto deve ser numérico.',
      'number.positive': 'O id do projecto deve ser maior que zero.',
      'any.required': 'O id do projeto é obrigatório.'
    }),
});

export const status_params = Joi.object({
  status: Joi.string().required()
})