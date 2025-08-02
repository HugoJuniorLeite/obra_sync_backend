import Joi from 'joi';

export const project_schema = Joi.object({
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

  number_contract: Joi.string()
    .min(3)
    .max(50)
    .required()
    .messages({
      'string.base': 'O número do contrato deve ser um texto.',
      'string.empty': 'O número do contrato é obrigatório.',
      'any.required': 'O número do contrato é obrigatório.'
    }),

  description: Joi.string()
    .max(1000)
    .allow(null, '')
    .messages({
      'string.base': 'A descrição deve ser um texto.',
      'string.max': 'A descrição deve ter no máximo {#limit} caracteres.'
    }),

  estimated_price: Joi.number()
    .positive()
    .precision(2)
    .required()
    .messages({
      'number.base': 'O preço estimado deve ser numérico.',
      'number.positive': 'O preço estimado deve ser maior que zero.',
      'any.required': 'O preço estimado é obrigatório.'
    }),

  start_date: Joi.date()
    .iso()
    .required()
    .messages({
      'date.base': 'A data de início deve ser uma data válida.',
      'date.format': 'A data de início deve estar no formato ISO (YYYY-MM-DD).',
      'any.required': 'A data de início é obrigatória.'
    }),

  estimated_end_date: Joi.date()
    .iso()
    .required()
    .greater(Joi.ref('start_date'))
    .messages({
      'date.base': 'A data estimada de término deve ser uma data válida.',
      'date.greater': 'A data de término deve ser depois da data de início.',
      'any.required': 'A data estimada de término é obrigatória.'
    })
});