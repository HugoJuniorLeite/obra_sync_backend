import Joi from "joi";


const first_access = Joi.object({
  cpf: Joi.string().length(11).required()
})

const auth_schema = {
    first_access, 
}
export default auth_schema;