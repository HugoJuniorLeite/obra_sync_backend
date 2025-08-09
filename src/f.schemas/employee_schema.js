import Joi from 'joi';

const employee_schema = Joi.object({
  name: Joi.string().required(),
  date_of_birth: Joi.string().isoDate().required(),
  rg: Joi.string().required(),
  cpf: Joi.string().length(11).required(),
  drivers_license: Joi.boolean().required(),
  occupation_id: Joi.number().integer().required(),
  admission_date: Joi.string().isoDate().required(),

  phones: Joi.object({
    create: Joi.object({
      phoneNumber: Joi.string().required()
    }).required()
  }).required(),

  cnhs: Joi.object({
    create: Joi.object({
      category_cnh: Joi.string().required(),
      number_license: Joi.string().required(),
      validity: Joi.string().isoDate().required(),
      first_drivers_license: Joi.string().isoDate().required()
    }).required()
  }).required(),

  address: Joi.object({
    create: Joi.object({
      zip_code: Joi.string().required(),
      street_name: Joi.string().required(),
      number_of_house: Joi.number().integer().required(),
      neighborhood: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().length(2).required(),
      country: Joi.string().required()
    }).required()
  }).required(),

  project_team: Joi.object({
    create: Joi.object({
      project_id: Joi.number().integer().required(),
      active: Joi.boolean().required()
    }).required()
  }).required()
});


export default employee_schema;