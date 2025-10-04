import auth_service from "../b.services/auth_service.js";

async function is_first_access_controller(req, res) {
    const { cpf } = req.body;

    if (!cpf) {
        return res.status(400).json({ success: false, message: "Obrigatório informar dados válidos" });
    }

    try {
        const access_already_exists = await auth_service.is_first_access_service(cpf);

        if (access_already_exists.first_access) {
            return res.status(200).json({
            
                response: access_already_exists.first_access,
                message: "Por favor, digite sua senha"
            });
        } else {
            return res.status(200).json({
        
                response: access_already_exists.first_access,
                message: "Por favor, digite os 6 primeiros dígitos do seu CPF e uma nova senha de acesso"
            });
        }
    } catch (error) {
     
        return res.status(404).json({
            success: false,
            message: error.message || "Erro inesperado"
        });
    }
}

async function compare_password_controller(req, res) {
    const {cpf, password} = req.body;
if (!cpf || !password) {
    throw new Error("Dados inválidos!");
    }
    try {
      const token = await auth_service.compare_password(cpf, password);
res.status(200).send({token: token, message: "Login realizado com sucesso!"})
    } catch (error) {
        return res.status(404).json({
            success: false,
            message: error.message || "Erro inesperado"
        });
    }
}

async function change_password_controller(req, res) {
    const {cpf, old_password, new_password} = req.body
    console.log(req.body);
    
    if (!old_password || !new_password) {
        throw new Error("Dados inseridos são inválidos Controller");
        }
    try {
await auth_service.change_password_service(cpf, old_password, new_password)
res.status(200).send("Senha alterada com sucesso!");
    } catch (error) {
        return res.status(error.status || 400).json({message: error.message}); 
    }
}

const auth_controller = {
    is_first_access_controller, change_password_controller, compare_password_controller
};

export default auth_controller;
