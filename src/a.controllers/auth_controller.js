import auth_service from "../b.services/auth_service.js";

async function is_first_access_controller(req, res) {
    const {cpf} = req.body;
 
    
if (!cpf || cpf === undefined) {
    res.status(400).send({message:"Obrigatório informar dados válidos"})
}

const access_already_exists = await auth_service.is_first_access_service(cpf);

console.log(access_already_exists, "controller");

if (access_already_exists.first_access) {
    res.status(200).send({response:access_already_exists.first_access, message: "Por favor, digite sua senha"})
} else {
    res.status(200).send({response:access_already_exists.first_access, message: "Por favor, digite os 6 primeiros dígitos do seu cpf e uma nova senha de acesso"})
}
    try {
        
    } catch (error) {
        return res.status(error.status || 400).json({message: error.message})
    }
}

const auth_controller = {
    is_first_access_controller,
};

export default auth_controller;