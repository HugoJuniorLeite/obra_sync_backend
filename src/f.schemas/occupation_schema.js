import Joi from 'joi';

export const occupation_schema = Joi.object({
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

  description_of_occupation: Joi.string()
    .max(1000)
    .allow(null, '')
    .messages({
      'string.base': 'A descrição deve ser um texto.',
      'string.max': 'A descrição deve ter no máximo {#limit} caracteres.'
    }),

  dangerousness: Joi.boolean()
    .required()
    .messages({
      'boolean.base': 'O campo periculosidade deve ser verdadeiro ou falso.',
      'any.required': 'O campo periculosidade é obrigatório.'
    }),

  salary: Joi.number()
    .precision(2) // garante duas casas decimais
    .positive()   // valor deve ser positivo
    .required()
    .messages({
      'number.base': 'O salário deve ser um número.',
      'number.positive': 'O salário deve ser um valor positivo.',
      'any.required': 'O salário é obrigatório.'
    })
});
