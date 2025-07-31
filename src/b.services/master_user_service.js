import master_user_repository from "../c.repositories/master_user_repository.js";
import sendEmail from "../config/mail_transporter.js"

async function validateMasterUser(email) {
    if (!email) {
        throw new Error("Por favor informe um email!");
        
    }
    const master_user_exists = await master_user_repository.verify_master_exists(email);
if (!master_user_exists) {
    throw new Error("Usuário não encontrado, entre em contato com o suporte");
}
function generate6DigitToken() {
     return Math.floor(100000 + Math.random() * 900000).toString();
   } 
   const token = generate6DigitToken();
  try {
    await master_user_repository.master_access_token(email, token)
 await sendEmail(email, token);
  } catch (error) {

     throw new Error("Não foi possível enviar o token para o email cadastrado");
    
  } 
}

const master_user_service = {
    validateMasterUser
}

export default master_user_service;