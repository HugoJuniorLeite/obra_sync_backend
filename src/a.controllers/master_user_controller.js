import master_user_service from "../b.services/master_user_service.js";

async function validate_master_user(req, res) {
    const email = req.body.email
   
    if(!email){
      throw new Error("É obrigatório informar o email");
            }
    try {
      await master_user_service.validateMasterUser(email);  
    res.status(200).send("Token enviado com sucesso")
    } catch (error) {
    
    return res.status(error.status || 404).json({message: "Não foi possível enviar o token"});
    }
}

const master_user_controller = {
    validate_master_user
}
 export default master_user_controller;