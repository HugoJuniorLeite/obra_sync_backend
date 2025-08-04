import firm_service from "../b.services/firm_service.js";

async function register_new_firm_controller(req, res) {
    const firm = req.body;
    try {
        const result = await firm_service.register_new_firm_service(firm)
    res.status(201).send(result)
    } catch (error) {
     return res.status(error.status || 400).json({message: error.message});     
    }
}

async function get_all_firms_controller(req,res ) {
    try {
        const result = await firm_service.get_firms()
         if (!result || result === null) {
            res.status(200).send("Não há nenhum projeto ativo com esse Id")
        }
    res.status(200).send(result)
    } catch (error) {
     return res.status(error.status || 400).json({message: error.message});     
    } 
}

async function get_firm_by_id_service(req,res) {
    const id = req.params.id
     try {
        const result = await firm_service.firm_by_id(id)
        if (!result || result === null) {
            res.status(200).send("Não há nenhum projeto ativo com esse Id")
        }
    res.status(200).send(result)
    } catch (error) {
     return res.status(error.status || 400).json({message: error.message});     
    }
}


async function update_firm_by_id(req, res) {
    const data = req.body
    const firm_id = req.params.firm_id

console.log(firm_id, "firm_id", req.body, "data", data);

    try {
        await firm_service.update_firm(data, firm_id)
        res.status(200).send("Dados alterados com sucesso")
    } catch (error) {
       return res.status(error.status || 400).json({message: error.message});      
    }
}

async function deactivate_firm_controller(req, res) {
    const firm_id = req.params.firm_id;
      try {
        await firm_service.deactivate_firm_service(firm_id)
        res.status(200).send("Cadastro excluído com sucesso")
    } catch (error) {
       return res.status(error.status || 400).json({message: error.message});      
    }
}

const firm_controller = {
    register_new_firm_controller, get_all_firms_controller, get_firm_by_id_service, update_firm_by_id,deactivate_firm_controller
}

export default firm_controller;