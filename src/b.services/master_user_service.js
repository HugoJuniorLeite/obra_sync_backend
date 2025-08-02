import master_user_repository from "../c.repositories/master_user_repository.js";
import sendEmail from "../config/mail_transporter.js"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


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
  const pass = token;
  const saltRounds = 10; 
  const hash = await bcrypt.hash(pass, saltRounds);
    await master_user_repository.master_access_token(email, hash)
 await sendEmail(email, token);
  } catch (error) {

     throw new Error("Não foi possível enviar o token para o email cadastrado");
    
  } 
}

async function validate_token(email, token) {
    if (!email || !token) {
        throw new Error("Preencha os campos obrigatórios!");
        }
    try {
        const master_user_exists = await master_user_repository.verify_master_exists(email);

    
        if (!master_user_exists || master_user_exists === null) {
        throw new Error("Usuário não encontrado, entre em contato com o suporte");
    }
        const isMatch = await bcrypt.compare(token, master_user_exists.token_access);
            
        if (!isMatch) {
              throw new Error("Login ou senha incorreta.");
            }
        if(isMatch){

            const JWT_SECRET = process.env.JWT_SECRET || "chave-muitooooo-secreta";

    const tokenJwt = jwt.sign(
      {
        id: master_user_exists.id,
        name: master_user_exists.name,
        role: "User Master",
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return tokenJwt;

        }
return
    } catch (error) {
        throw new Error(error.message)
    }
    
}

const master_user_service = {
    validateMasterUser, validate_token
}

export default master_user_service;