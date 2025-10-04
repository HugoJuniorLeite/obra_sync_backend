import master_user_service from "../b.services/master_user_service.js";

async function validate_master_user(req, res) {
    const email = req.body.email
   console.log(req.body, "validate");
    if(!email){
      throw new Error("É obrigatório informar o email");
            }
    try {
      await master_user_service.validateMasterUser(email);  
    res.status(200).send("Token enviado com sucesso")
    } catch (error) {
    
    return res.status(error.status || 404).json({message: error.message});
    }
}

async function validate_token_controller(req, res) {
  const {email, token_access} = req.body;
console.log(req.body, "auth");

  try {
   const token = await master_user_service.validate_token(email, token_access)
    res.status(200).send(token)
  } catch (error) {
       return res.status(error.status || 404).json({message: error.message});
 
  }
}

const master_user_controller = {
    validate_master_user, validate_token_controller
}
 export default master_user_controller;